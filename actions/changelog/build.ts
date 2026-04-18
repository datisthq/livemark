import { readFile, writeFile, mkdir, access } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import type { Config } from "../../models/config.ts"
import type { SectionDef } from "../../website/helpers/section.ts"
import {
  isGitHubUrl,
  parseGitHubRepo,
} from "../../website/helpers/changelog-source.ts"

interface Release {
  tag_name: string
  name?: string | null
  published_at?: string | null
  body?: string | null
}

interface CacheMeta {
  etag: string
  fetchedAt: string
}

const CACHE_FILE = ".livemark/cache/changelog.md"
const META_FILE = ".livemark/cache/changelog.meta.json"

/** Build the changelog cache file for a changelog section */
export async function buildChangelog(section: SectionDef, config: Config) {
  if (!section.source) {
    throw new Error(
      `Changelog section at ${section.prefix} requires a source (filepath or GitHub URL)`,
    )
  }

  const cachePath = join(config.root, CACHE_FILE)
  const metaPath = join(config.root, META_FILE)
  await mkdir(dirname(cachePath), { recursive: true })

  const body = isGitHubUrl(section.source)
    ? await fetchGitHubChangelog(section.source, metaPath, cachePath)
    : await readLocalChangelog(section.source, config.root)

  if (body === undefined) return

  const markdown = wrapFrontmatter(body, section)
  await writeFile(cachePath, markdown, "utf-8")
}

export function cacheIncludeGlob() {
  return CACHE_FILE
}

async function readLocalChangelog(source: string, root: string) {
  const filePath = resolve(root, source)
  return await readFile(filePath, "utf-8")
}

async function fetchGitHubChangelog(
  source: string,
  metaPath: string,
  cachePath: string,
) {
  const parsed = parseGitHubRepo(source)
  if (!parsed) {
    throw new Error(`Could not parse GitHub repo from source: ${source}`)
  }

  const url = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases?per_page=100`
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  const meta = await readMeta(metaPath)
  if (meta && (await exists(cachePath))) {
    headers["If-None-Match"] = meta.etag
  }

  const res = await fetch(url, { headers })

  if (res.status === 304) return undefined

  if (!res.ok) {
    const remaining = res.headers.get("x-ratelimit-remaining")
    const reset = res.headers.get("x-ratelimit-reset")
    const hasCache = await exists(cachePath)
    const msg = `GitHub API ${res.status} ${res.statusText} (rate-limit remaining: ${remaining ?? "?"}, reset: ${reset ?? "?"})`
    if (hasCache) {
      console.warn(`${msg} — falling back to cached changelog`)
      return undefined
    }
    throw new Error(msg)
  }

  const releases = (await res.json()) as Release[]
  const body = formatReleases(releases)

  const etag = res.headers.get("etag")
  if (etag) {
    await writeFile(
      metaPath,
      JSON.stringify(
        { etag, fetchedAt: new Date().toISOString() } satisfies CacheMeta,
        null,
        2,
      ),
      "utf-8",
    )
  }

  return body
}

function formatReleases(releases: Release[]) {
  const sorted = [...releases].sort((a, b) => {
    const da = a.published_at ? new Date(a.published_at).getTime() : 0
    const db = b.published_at ? new Date(b.published_at).getTime() : 0
    return db - da
  })

  const sections = sorted.map(release => {
    const tag = release.tag_name
    const date = release.published_at?.slice(0, 10) ?? ""
    const heading = date ? `## ${tag} - ${date}` : `## ${tag}`
    const body = (release.body ?? "").trim()
    return body ? `${heading}\n\n${body}` : heading
  })

  return `# Changelog\n\n${sections.join("\n\n")}\n`
}

function wrapFrontmatter(body: string, section: SectionDef) {
  const lines = [
    "---",
    `title: ${section.title}`,
    `path: ${section.prefix}`,
    "sidebar: false",
    "---",
    "",
    body,
  ]
  return lines.join("\n")
}

async function readMeta(metaPath: string): Promise<CacheMeta | undefined> {
  try {
    const raw = await readFile(metaPath, "utf-8")
    return JSON.parse(raw) as CacheMeta
  } catch {
    return undefined
  }
}

async function exists(path: string) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
