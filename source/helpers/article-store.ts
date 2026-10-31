import { existsSync, globSync, readFileSync } from "node:fs"
import { availableParallelism } from "node:os"
import { isAbsolute, matchesGlob, relative, resolve, sep } from "node:path"
import { ZodError, prettifyError } from "zod"
import type { Config } from "../models/config.ts"
import { TWOSLASH_FENCE } from "../actions/article/compile.ts"
import { DIRECTIVE_NAMES } from "../actions/processor/create.ts"
import { findContentWarnings } from "./content-warnings.ts"
import { loadArticle, type LoadedArticle } from "../actions/article/load.ts"
import { prepareArticles, type ArticleScope } from "../actions/article/prepare.ts"
import { warmTwoslash } from "../plugins/twoslash.ts"

export type ArticleStore = ReturnType<typeof createArticleStore>

/** The project's articles, held in memory: loaded once on first use, then kept
 *  current one file at a time. */
export function createArticleStore(config: Config) {
  const articles = new Map<string, LoadedArticle>()
  const failures = new Map<string, string>()
  const warnings = new Map<string, string>()
  let scope: Promise<ArticleScope> | undefined

  return {
    /** Every article, ordered by file. */
    async list() {
      await readScope()
      return [...articles.values()]
    },
    /** Reload or drop the article at an absolute path; false when it is none. */
    async sync(path: string) {
      const current = await readScope()
      const file = readProjectFile(config, path)
      if (!isArticleFile(current, file)) return false
      if (!existsSync(path)) {
        failures.delete(file)
        return articles.delete(file)
      }
      const article = await loadOrReport(current, file)
      if (article) articles.set(file, article)
      else articles.delete(file)
      sortArticles()
      return true
    },
    /** The articles left out, by project-relative file, with why. */
    readFailures() {
      return [...failures]
    },
    /** Throw, naming each, when an article was left out: a build must not ship without it. */
    assertLoaded() {
      if (failures.size === 0) return
      const count = failures.size === 1 ? "1 article" : `${failures.size} articles`
      const files = [...failures.keys()].join(", ")
      throw new Error(`${count} failed to load, as reported above: ${files}`)
    },
  }

  function readScope() {
    scope ??= prepareArticles(config).then(async current => {
      await loadAll(current)
      return current
    })
    return scope
  }

  async function loadAll(current: ArticleScope) {
    const files = globSync(current.include, {
      cwd: config.root,
      exclude: current.exclude,
    })
      .map(file => readProjectFile(config, file))
      .sort((a, b) => a.localeCompare(b))
    // TypeScript takes ~0.8 s to start for twoslash; started now, in its worker, it is
    // ready by the time the build reaches a page with a twoslash block
    if (files.some(file => TWOSLASH_FENCE.test(readText(file)))) warmTwoslash()
    const loaded = await mapLimited(files, file => loadOrReport(current, file))
    files.forEach((file, index) => {
      const article = loaded[index]
      if (article) articles.set(file, article)
    })
    await current.cache.prune()
  }

  // A broken article is reported and left out, so one typo cannot take the site down.
  // An editor's save fires the watcher twice; an unchanged error is reported once.
  async function loadOrReport(current: ArticleScope, file: string) {
    try {
      const article = await loadArticle(current, file)
      failures.delete(file)
      reportWarnings(file)
      return article
    } catch (error) {
      const message = formatFailure(error)
      if (failures.get(file) !== message)
        console.error(`[livemark] skipped ${file}:\n${message}`)
      failures.set(file, message)
      return undefined
    }
  }

  function reportWarnings(file: string) {
    const found = findContentWarnings({
      text: readText(file),
      filePath: resolve(config.root, file),
      directives: KNOWN_DIRECTIVES,
    }).join("\n")
    if (found && warnings.get(file) !== found)
      console.warn(`[livemark] ${file}:\n${found}`)
    warnings.set(file, found)
  }

  function sortArticles() {
    const sorted = [...articles].sort(([a], [b]) => a.localeCompare(b))
    articles.clear()
    for (const [file, article] of sorted) articles.set(file, article)
  }

  function readText(file: string) {
    return readFileSync(resolve(config.root, file), "utf-8")
  }
}

// `::include` is resolved before the article compiles
const KNOWN_DIRECTIVES = new Set([...DIRECTIVE_NAMES, "include"])

function formatFailure(error: unknown) {
  if (error instanceof ZodError) return prettifyError(error)
  return error instanceof Error ? error.message : String(error)
}

// Article keys are "/"-separated on every platform: they derive URLs and match globs
function readProjectFile(config: Config, path: string) {
  const file = isAbsolute(path) ? relative(config.root, path) : path
  return file.split(sep).join("/")
}

function isArticleFile(scope: ArticleScope, file: string) {
  const absolute = resolve(scope.config.root, file)
  const matches = (pattern: string) =>
    matchesGlob(isAbsolute(pattern) ? absolute : file, pattern)
  return scope.include.some(matches) && !scope.exclude.some(matches)
}

async function mapLimited<T, R>(items: T[], fn: (item: T) => Promise<R>) {
  const results: R[] = []
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      const item = items[index]
      if (item !== undefined) results[index] = await fn(item)
    }
  }
  await Promise.all(Array.from({ length: availableParallelism() }, worker))
  return results
}
