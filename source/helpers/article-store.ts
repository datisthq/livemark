import { existsSync, globSync, readFileSync } from "node:fs"
import { availableParallelism } from "node:os"
import { isAbsolute, matchesGlob, relative, resolve, sep } from "node:path"
import type { Config } from "../models/config.ts"
import { TWOSLASH_FENCE } from "../actions/article/compile.ts"
import { loadArticle, type LoadedArticle } from "../actions/article/load.ts"
import { prepareArticles, type ArticleScope } from "../actions/article/prepare.ts"
import { warmTwoslash } from "../plugins/twoslash.ts"

export type ArticleStore = ReturnType<typeof createArticleStore>

/** The project's articles, held in memory: loaded once on first use, then kept
 *  current one file at a time. */
export function createArticleStore(config: Config) {
  const articles = new Map<string, LoadedArticle>()
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
      if (!existsSync(path)) return articles.delete(file)
      const article = await loadOrReport(current, file)
      if (article) articles.set(file, article)
      else articles.delete(file)
      sortArticles()
      return true
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

  function sortArticles() {
    const sorted = [...articles].sort(([a], [b]) => a.localeCompare(b))
    articles.clear()
    for (const [file, article] of sorted) articles.set(file, article)
  }

  function readText(file: string) {
    return readFileSync(resolve(config.root, file), "utf-8")
  }
}

// A broken article is reported and left out, so one typo cannot take the site down
async function loadOrReport(scope: ArticleScope, file: string) {
  try {
    return await loadArticle(scope, file)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[livemark] skipped ${file}: ${message}`)
    return undefined
  }
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
