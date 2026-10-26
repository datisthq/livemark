import { existsSync, statSync, watch, type FSWatcher } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { createBuilder } from "@content-collections/core"
import { configureLogging } from "@content-collections/integrations"
import type { Plugin } from "vite"
import {
  ARTICLE_BODY_ID,
  ARTICLES_ID,
  SEARCH_INDEX_ID,
  readGeneratedArticles,
  renderArticlesModule,
  renderBodyModule,
  renderSearchModule,
} from "../helpers/article-modules.ts"
import { createTaskQueue } from "../helpers/task-queue.ts"

export interface ContentOptions {
  configPath: string
  contentDir: string
}

type Builder = Awaited<ReturnType<typeof createBuilder>>

const IGNORED_PATHS = /(^|[/\\])(node_modules|\.[^/\\]+)([/\\]|$)/

/** Build the content collections and rebuild them on edits, one build at a time:
 *  `@content-collections/vite` builds per file event, a save fires two, and their
 *  overlapping writes tore `allArticles.js` so every request failed. Serves the
 *  articles split for the client: a light list, a chunk per article body and one per
 *  language's search text (`helpers/article-modules.ts`). */
export function content(opts: ContentOptions): Plugin {
  const queue = createTaskQueue({ onError: error => console.error(error) })
  let builder: Builder | undefined
  let initialBuild: Promise<void> | undefined
  let watcher: FSWatcher | undefined
  let generated = ""
  return {
    name: "livemark:content",
    config(config) {
      const configPath = resolve(config.root ?? process.cwd(), opts.configPath)
      generated = join(dirname(configPath), ".content-collections", "generated")
      return {
        optimizeDeps: { exclude: ["content-collections"] },
        resolve: { alias: { "content-collections": generated } },
        ...((config.server?.fs?.allow?.length ?? 0) > 0 && {
          server: { fs: { allow: [generated] } },
        }),
      }
    },
    async configResolved(config) {
      builder = await createBuilder(resolve(config.root, opts.configPath))
      configureLogging(builder)
    },
    resolveId(id) {
      if (id === ARTICLES_ID) return `\0${id}`
      if (id.startsWith(ARTICLE_BODY_ID) || id.startsWith(SEARCH_INDEX_ID))
        return `\0${id}`
      return null
    },
    async load(id) {
      if (!id.startsWith("\0livemark:")) return null
      const name = id.slice(1)
      const isArticles = name === ARTICLES_ID
      const isBody = name.startsWith(ARTICLE_BODY_ID)
      const isSearch = name.startsWith(SEARCH_INDEX_ID)
      if (!isArticles && !isBody && !isSearch) return null
      const file = join(generated, "allArticles.js")
      // Re-runs this load when content-collections rewrites the file, so dev edits
      // reach the split modules through Vite's own HMR.
      this.addWatchFile(file)
      // Imported, not parsed: the generated module is JavaScript (`undefined` values),
      // and the mtime query re-reads it after a rebuild instead of Node's cached copy.
      const url = `${pathToFileURL(file).href}?v=${statSync(file).mtimeMs}`
      const module: { default: unknown } = await import(url)
      const articles = readGeneratedArticles(module.default)
      if (isArticles) return renderArticlesModule(articles)
      if (isBody) return renderBodyModule(articles, name.slice(ARTICLE_BODY_ID.length))
      return renderSearchModule(articles, name.slice(SEARCH_INDEX_ID.length))
    },
    buildStart() {
      const current = builder
      if (!current) return
      // Once, not per environment, and through the queue so an edit landing
      // before it cannot overlap it.
      initialBuild ??= new Promise((resolve, reject) => {
        queue.enqueue("build", () => current.build().then(resolve, reject))
      })
      return initialBuild
    },
    configureServer() {
      const current = builder
      if (!current) return
      watcher = watch(
        opts.contentDir,
        { recursive: true, ignore: IGNORED_PATHS },
        (_, filename) => {
          if (!filename) return
          const file = join(opts.contentDir, filename)
          queue.enqueue(file, () =>
            current.sync(existsSync(file) ? "update" : "delete", file),
          )
        },
      )
    },
    closeBundle() {
      watcher?.close()
      watcher = undefined
    },
  }
}
