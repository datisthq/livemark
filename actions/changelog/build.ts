import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import slugify from "@sindresorhus/slugify"
import type { Root, RootContent } from "mdast"
import { toString as mdastToString } from "mdast-util-to-string"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import type { Config } from "../../models/config.ts"
import type { ChangelogSection } from "../../models/section.ts"
import {
  isGitHubUrl,
  parseGitHubRepo,
} from "../../website/helpers/changelog-source.ts"

interface Release {
  tag_name: string
  name?: string | null
  published_at?: string | null
  body?: string | null
  html_url?: string | null
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
  sourceUrl?: string
}

const CACHE_DIR = ".livemark/cache/changelog"
const META_FILE = ".livemark/cache/changelog.meta.json"

const parser = unified().use(remarkParse)
const stringifier = unified().use(remarkStringify, {
  bullet: "-",
  fences: true,
  emphasis: "_",
})

export function cacheIncludeGlob() {
  return `${CACHE_DIR}/**/*.md`
}

/** Build the per-version changelog cache files for a changelog section */
export async function buildChangelog(
  section: ChangelogSection,
  config: Config,
) {
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

/** Parse CHANGELOG.md into per-version entries using mdast */
export function splitLocalChangelog(body: string): ChangelogEntry[] {
  const tree = parser.parse(body) as Root
  const entries: ChangelogEntry[] = []
  let current: { heading: string; children: RootContent[] } | undefined

  for (const child of tree.children) {
    if (child.type === "heading" && child.depth === 2) {
      if (current) entries.push(finalizeEntry(current))
      current = { heading: mdastToString(child), children: [] }
    } else if (current) {
      current.children.push(child)
    }
  }
  if (current) entries.push(finalizeEntry(current))
  return entries
}

function finalizeEntry(input: {
  heading: string
  children: RootContent[]
}): ChangelogEntry {
  const versionMatch = input.heading.match(/^\[?([^\]\s]+)\]?/)
  const version = versionMatch?.[1] ?? input.heading
  const dateMatch = input.heading.match(/\d{4}-\d{2}-\d{2}/)
  const body = renderEntryBody(input.children)
  return {
    slug: slugify(version),
    title: version,
    date: dateMatch?.[0],
    body,
  }
}

/** Serialize an entry's mdast children back to markdown */
function renderEntryBody(children: RootContent[]) {
  const root: Root = { type: "root", children }
  return stringifier.stringify(root).trimEnd()
}

/** Drop the body's leading h1 (typically the conventional-changelog
 * `# 0.7.2 (2026-04-25)` boilerplate that duplicates the article's title),
 * shift h2–h6 up by one so subsection headings become h1 / h2 / …, and
 * escape stray `<` outside code so MDX doesn't mistake them for JSX. */
function processBody(body: string) {
  const tree = parser.parse(body) as Root
  visit(tree, "heading", node => {
    if (node.depth > 1) node.depth = (node.depth - 1) as 1 | 2 | 3 | 4 | 5
  })
  if (tree.children[0]?.type === "heading" && tree.children[0].depth === 1) {
    tree.children.shift()
  }
  return escapeMdxAngles(stringifier.stringify(tree).trimEnd())
}

/** Escape `<` to `\<` outside fenced code blocks and inline backtick spans
 * so commit messages with placeholders like `<subdir>` don't get parsed as
 * JSX by MDX. */
function escapeMdxAngles(markdown: string) {
  let inFence = false
  return markdown
    .split("\n")
    .map(line => {
      if (line.startsWith("```")) {
        inFence = !inFence
        return line
      }
      if (inFence) return line
      return line.replace(/`[^`]*`|</g, match =>
        match === "<" ? "\\<" : match,
      )
    })
    .join("\n")
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
    date: release.published_at ?? undefined,
    body: (release.body ?? "").trim(),
    sourceUrl: release.html_url ?? undefined,
  }))
}

function wrapFrontmatter(entry: ChangelogEntry, section: ChangelogSection) {
  const lines = [
    "---",
    `title: ${entry.title}`,
    `path: ${section.prefix}${entry.slug}/`,
  ]
  if (entry.date) lines.push(`date: ${entry.date}`)
  if (entry.sourceUrl) {
    lines.push(`sourceUrl: ${entry.sourceUrl}`, "sourceAction: view")
  }
  lines.push("---", "", `# ${entry.title}`, "", processBody(entry.body))
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
