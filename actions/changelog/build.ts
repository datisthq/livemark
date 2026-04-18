import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import slugify from "@sindresorhus/slugify"
import type { Config } from "../../models/config.ts"
import {
  isGitHubUrl,
  parseGitHubRepo,
} from "../../website/helpers/changelog-source.ts"
import type { SectionDef } from "../../website/helpers/section.ts"

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

interface ChangelogEntry {
  slug: string
  title: string
  date?: string
  body: string
}

const CACHE_DIR = ".livemark/cache/changelog"
const META_FILE = ".livemark/cache/changelog.meta.json"

export function cacheIncludeGlob() {
  return `${CACHE_DIR}/**/*.md`
}

/** Build the per-version changelog cache files for a changelog section */
export async function buildChangelog(section: SectionDef, config: Config) {
  if (!section.source) {
    throw new Error(
      `Changelog section at ${section.prefix} requires a source (filepath or GitHub URL)`,
    )
  }

  const cacheDir = join(config.root, CACHE_DIR)
  const metaPath = join(config.root, META_FILE)

  const entries = isGitHubUrl(section.source)
    ? await buildFromGitHub(section.source, metaPath, cacheDir)
    : await buildFromLocal(section.source, config.root)

  if (entries === undefined) return

  await rm(cacheDir, { recursive: true, force: true })
  await mkdir(cacheDir, { recursive: true })

  for (const entry of entries) {
    const markdown = wrapFrontmatter(entry, section)
    await writeFile(join(cacheDir, `${entry.slug}.md`), markdown, "utf-8")
  }
}

async function buildFromLocal(source: string, root: string) {
  const filePath = resolve(root, source)
  const body = await readFile(filePath, "utf-8")
  return splitLocalChangelog(body)
}

function splitLocalChangelog(body: string): ChangelogEntry[] {
  const lines = body.split("\n")
  const entries: ChangelogEntry[] = []
  let current: { heading: string; bodyLines: string[] } | undefined

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) entries.push(parseLocalEntry(current))
      current = { heading: line.slice(3).trim(), bodyLines: [] }
    } else if (current) {
      current.bodyLines.push(line)
    }
  }
  if (current) entries.push(parseLocalEntry(current))
  return entries
}

function parseLocalEntry(input: {
  heading: string
  bodyLines: string[]
}): ChangelogEntry {
  const versionMatch = input.heading.match(/^\[?([^\]\s]+)\]?/)
  const version = versionMatch?.[1] ?? input.heading
  const dateMatch = input.heading.match(/\d{4}-\d{2}-\d{2}/)
  return {
    slug: slugify(version),
    title: version,
    date: dateMatch?.[0],
    body: input.bodyLines.join("\n").trim(),
  }
}

async function buildFromGitHub(
  source: string,
  metaPath: string,
  cacheDir: string,
): Promise<ChangelogEntry[] | undefined> {
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
  const hasCache = await exists(cacheDir)
  if (meta && hasCache) headers["If-None-Match"] = meta.etag

  const res = await fetch(url, { headers })

  if (res.status === 304) return undefined

  if (!res.ok) {
    const remaining = res.headers.get("x-ratelimit-remaining")
    const reset = res.headers.get("x-ratelimit-reset")
    const msg = `GitHub API ${res.status} ${res.statusText} (rate-limit remaining: ${remaining ?? "?"}, reset: ${reset ?? "?"})`
    if (hasCache) {
      console.warn(`${msg} — falling back to cached changelog`)
      return undefined
    }
    throw new Error(msg)
  }

  const releases = (await res.json()) as Release[]
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

  return releases.map(release => ({
    slug: slugify(release.tag_name),
    title: release.tag_name,
    date: release.published_at?.slice(0, 10),
    body: (release.body ?? "").trim(),
  }))
}

function wrapFrontmatter(entry: ChangelogEntry, section: SectionDef) {
  const lines = [
    "---",
    `title: ${entry.title}`,
    `path: ${section.prefix}${entry.slug}/`,
  ]
  if (entry.date) lines.push(`date: ${entry.date}`)
  lines.push("---", "", `# ${entry.title}`, "", promoteHeadings(entry.body))
  return lines.join("\n")
}

/** Shift h3–h6 up by one level to fill the gap left by stripping the version h2 */
function promoteHeadings(body: string) {
  return body.replace(/^(#{3,6})\s/gm, match => match.slice(1))
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
