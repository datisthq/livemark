import { watch, type FSWatcher } from "node:fs"
import { join } from "node:path"
import type { Plugin } from "vite"
import {
  ARTICLE_BODY_ID,
  ARTICLES_ID,
  SEARCH_INDEX_ID,
  assertUniquePaths,
  renderArticlesModule,
  renderBodyModule,
  renderSearchModule,
} from "../helpers/article-modules.ts"
import type { ArticleStore } from "../helpers/article-store.ts"
import { createTaskQueue } from "../helpers/task-queue.ts"

export interface ContentOptions {
  store: ArticleStore
  contentDir: string
}

const IGNORED_PATHS = /(^|[/\\])(node_modules|\.[^/\\]+)([/\\]|$)/

/** Serve the project's articles split for the client: a light list, a chunk per
 *  article body and one per language's search text (`helpers/article-modules.ts`).
 *  In dev, an edit reloads its one article, one at a time, and hot-updates only the
 *  modules whose code changed. */
export function content(opts: ContentOptions): Plugin {
  const queue = createTaskQueue({ onError: error => console.error(error) })
  // The code each loaded module was last served, to tell which an edit changed
  const served = new Map<string, string>()
  let watcher: FSWatcher | undefined
  return {
    name: "livemark:content",
    resolveId(id) {
      if (id === ARTICLES_ID) return `\0${id}`
      if (id.startsWith(ARTICLE_BODY_ID) || id.startsWith(SEARCH_INDEX_ID))
        return `\0${id}`
      return null
    },
    async load(id) {
      const code = await renderModule(id)
      if (code !== undefined) served.set(id, code)
      return code
    },
    async buildStart() {
      await opts.store.list()
    },
    configureServer(server) {
      watcher = watch(
        opts.contentDir,
        { recursive: true, ignore: IGNORED_PATHS },
        (_, filename) => {
          if (!filename) return
          const file = join(opts.contentDir, filename)
          queue.enqueue(file, async () => {
            if (!(await opts.store.sync(file))) return
            for (const [id, code] of served) {
              if ((await renderModule(id)) === code) continue
              served.delete(id)
              for (const environment of Object.values(server.environments)) {
                const module = environment.moduleGraph.getModuleById(id)
                if (module) await environment.reloadModule(module)
              }
            }
          })
        },
      )
    },
    closeBundle() {
      watcher?.close()
      watcher = undefined
    },
  }

  async function renderModule(id: string) {
    if (!id.startsWith("\0livemark:")) return undefined
    const name = id.slice(1)
    const isArticles = name === ARTICLES_ID
    const isBody = name.startsWith(ARTICLE_BODY_ID)
    const isSearch = name.startsWith(SEARCH_INDEX_ID)
    if (!isArticles && !isBody && !isSearch) return undefined
    const articles = await opts.store.list()
    if (isArticles) {
      assertUniquePaths(articles)
      return renderArticlesModule(articles)
    }
    if (isBody) return renderBodyModule(articles, name.slice(ARTICLE_BODY_ID.length))
    return renderSearchModule(articles, name.slice(SEARCH_INDEX_ID.length))
  }
}
