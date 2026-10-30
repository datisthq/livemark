import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { basename, relative, resolve } from "node:path"
import { DEFAULT_EXCLUDES } from "./settings.ts"
import { defineCollection, defineConfig } from "@content-collections/core"
import { compileArticle } from "./actions/article/compile.ts"
import { loadConfig } from "./actions/config/load.ts"
import { buildChangelog, cacheIncludeGlob } from "./actions/changelog/build.ts"
import { Article } from "./models/article.ts"
import { buildEditUrl, readRepository } from "./helpers/edit-url.ts"
import { resolveArticlePath } from "./helpers/article-path.ts"
import { resolveAssetPath } from "./helpers/resolve-asset-path.ts"
import { resolveIncludes } from "./helpers/resolve-includes.ts"
import { extractSearchText } from "./helpers/search-text.ts"
import { stripLeadingH1 } from "./helpers/llms.ts"
import {
  buildSites,
  detectLanguage,
  localizeArticlePath,
  resolveLanguages,
} from "./helpers/site.ts"

const config = await loadConfig()

const [defaultSite] = buildSites(config)
const languages = resolveLanguages(config.languages)
const changelogSections =
  defaultSite.config.sections?.filter(s => s.type === "changelog") ?? []
for (const section of changelogSections) {
  await buildChangelog(section, config)
}

const configInclude = Array.isArray(config.include) ? config.include : [config.include]
const include = [
  ...configInclude,
  ...changelogSections.map(section => cacheIncludeGlob(section, config)),
]

const userExclude = config.exclude
  ? Array.isArray(config.exclude)
    ? config.exclude
    : [config.exclude]
  : []
// When the consumer doesn't have a .gitignore, fall back to a sensible
// floor so `**/*.md` doesn't sweep up every README.md under node_modules,
// build outputs, etc. With a .gitignore present we trust the user.
const hasGitignore = existsSync(resolve(config.root, ".gitignore"))
const defaultExclude = hasGitignore ? [] : [...DEFAULT_EXCLUDES]
const exclude = [...defaultExclude, ...userExclude]

// content-collections compiles this file to .content-collections/cache/;
// going up 2 levels reconstructs the baseDirectory it uses for path resolution
const baseDir = resolve(import.meta.dirname, "../..")
const directory = relative(baseDir, config.root) || "."

const lastUpdatedByFile = readLastUpdatedDates()
const repository = readRepository(config.root)

// One `git log` for every file: a spawn per article blocks the build ~30 ms each, and
// isn't cached across builds like the MDX is.
function readLastUpdatedDates() {
  const dates = new Map<string, string>()
  try {
    const log = execFileSync(
      "git",
      [
        "-c",
        "core.quotePath=false",
        "log",
        "--format=%x00%cI",
        "--name-only",
        "--relative",
      ],
      {
        cwd: config.root,
        encoding: "utf-8",
        maxBuffer: 256 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      },
    )
    let date: string | undefined
    for (const line of log.split("\n")) {
      if (line.startsWith("\0")) date = line.slice(1)
      else if (line && date && !dates.has(line)) dates.set(line, date)
    }
    return dates
  } catch {
    return dates
  }
}

function extractTitle(content: string, path: string) {
  const match = /^#\s+(.+)$/m.exec(content)
  if (match) return match[1]!
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.\w+$/, "") ?? path
  )
}

const articles = defineCollection({
  name: "articles",
  directory,
  include,
  exclude,
  schema: Article,
  transform: async (document, context) => {
    const patch = config.patches?.find(p => p.file === document._meta.filePath)
    const doc = patch ? { ...document, ...patch.article } : document
    const filePath = resolve(config.root, doc._meta.filePath)
    const content = await resolveIncludes(doc.content, filePath)
    const title = doc.title ?? extractTitle(content, doc._meta.path)
    const icon = doc.icon
    const detected = detectLanguage({
      file: basename(doc._meta.filePath),
      language: doc.language,
      languages,
    })
    const key = resolveArticlePath({
      file: doc._meta.filePath,
      name: detected.name,
      include: configInclude,
      path: doc.path,
    })
    const path = localizeArticlePath(key, detected.language)
    // The article's h1 is rendered from `title` by the layout, so strip any
    // leading h1 in the body to avoid two h1s side-by-side (especially when
    // a content patch overrides the title to something different from the
    // body's own heading).
    const bodyContent = stripLeadingH1(content)
    const { mdx, tocItems } = await compileArticle(
      context,
      { ...doc, content: bodyContent },
      { format: doc.format, config, filePath },
    )
    const searchText = extractSearchText(content)
    const lastUpdated = lastUpdatedByFile.get(doc._meta.filePath)
    const image = doc.image
      ? resolveAssetPath(doc.image, filePath, config.root, config.base)
      : undefined
    return {
      ...doc,
      file: doc._meta.filePath,
      sourceUrl:
        doc.sourceUrl ?? (repository && buildEditUrl(repository, doc._meta.filePath)),
      lastUpdated,
      image,
      title,
      icon,
      path,
      key,
      language: detected.language.code,
      tocItems,
      searchText,
      mdx,
    }
  },
})

export default defineConfig({
  // @ts-expect-error tsgo picks wrong overload when rehype-slug augments unified types
  content: [articles],
})
