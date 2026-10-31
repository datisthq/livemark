import { existsSync, globSync, readFileSync, watch, type FSWatcher } from "node:fs"
import { join } from "node:path"
import type { Plugin, ViteDevServer } from "vite"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../settings.ts"
import { buildSites } from "../actions/site/build.ts"
import type { Config } from "../models/config.ts"
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
import { collectIconKeys, renderIconsModule } from "../helpers/icon-names.ts"
import { createTaskQueue } from "../helpers/task-queue.ts"

export interface ContentOptions {
  config: Config
  store: ArticleStore
}

const ICONS_ID = "livemark:icons"

const IGNORED_PATHS = /(^|[/\\])(node_modules|\.[^/\\]+)([/\\]|$)/

/** Serve the project's articles split for the client: a light list, a chunk per
 *  article body and one per language's search text (`helpers/article-modules.ts`),
 *  and the Lucide icons the site uses. In dev, an edit reloads its one article, one
 *  at a time, and hot-updates only the modules whose code changed. */
export function content(opts: ContentOptions): Plugin {
  const queue = createTaskQueue({ onError: error => console.error(error) })
  // The code each loaded module was last served, to tell which an edit changed
  const served = new Map<string, string>()
  let watcher: FSWatcher | undefined
  let building = false
  return {
    name: "livemark:content",
    resolveId(id) {
      if (id === ARTICLES_ID || id === ICONS_ID) return `\0${id}`
      if (id.startsWith(ARTICLE_BODY_ID) || id.startsWith(SEARCH_INDEX_ID))
        return `\0${id}`
      return null
    },
    async load(id) {
      const code = await renderModule(id)
      if (code !== undefined) served.set(id, code)
      return code
    },
    configResolved(config) {
      building = config.command === "build"
    },
    async buildStart() {
      await opts.store.list()
      if (building) opts.store.assertLoaded()
    },
    configureServer(server) {
      const root = opts.config.root
      watcher = watch(root, { recursive: true, ignore: IGNORED_PATHS }, (_, filename) => {
        if (!filename) return
        const file = join(root, filename)
        queue.enqueue(file, async () => {
          if (!(await opts.store.sync(file))) return
          await reloadChanged(server)
          showFailures(server)
        })
      })
      // A reload or a new tab must see a broken article too, not only the open page
      server.ws.on("connection", () => showFailures(server))
      // An escaped component can start using an icon; the watcher above skips `.livemark/`
      server.watcher.on("change", file => {
        if (!file.startsWith(join(root, ".livemark", ""))) return
        queue.enqueue(ICONS_ID, () => reloadChanged(server))
      })
    },
    closeBundle() {
      watcher?.close()
      watcher = undefined
    },
  }

  // Vite's overlay shows one error; after the reload above, so its update can't clear it
  function showFailures(server: ViteDevServer) {
    const [failure] = opts.store.readFailures()
    if (!failure) return
    const [file, message] = failure
    server.ws.send({
      type: "error",
      err: {
        message: `${file} was left out of the site:\n${message}`,
        stack: "",
        id: join(opts.config.root, file),
        plugin: "livemark",
      },
    })
  }

  async function reloadChanged(server: ViteDevServer) {
    for (const [id, code] of served) {
      if ((await renderModule(id)) === code) continue
      served.delete(id)
      for (const environment of Object.values(server.environments)) {
        const module = environment.moduleGraph.getModuleById(id)
        if (module) await environment.reloadModule(module)
      }
    }
  }

  async function renderModule(id: string) {
    if (!id.startsWith("\0livemark:")) return undefined
    const name = id.slice(1)
    if (name === ICONS_ID) return renderIcons()
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

  async function renderIcons() {
    const articles = await opts.store.list()
    const { icons } = await import("lucide-react")
    const configIcons = buildSites(opts.config).flatMap(site => [
      ...(site.config.sections ?? []).map(section => section.icon),
      ...(site.config.links ?? []).map(link => link.icon),
    ])
    const keys = collectIconKeys({
      names: [...configIcons, ...articles.map(a => a.icon)].filter(isString),
      texts: [...articles.map(a => a.mdx), ...readEscapeSources(opts.config.root)],
      known: new Set(Object.keys(icons)),
    })
    return renderIconsModule(keys)
  }
}

function readEscapeSources(root: string) {
  const dir = join(root, ".livemark")
  const patterns = [
    ...ESCAPABLE_FOLDERS.map(folder => `${folder}/**/*.{ts,tsx,js,jsx}`),
    ...ESCAPABLE_FILES,
  ]
  if (!existsSync(dir)) return []
  return globSync(patterns, { cwd: dir }).map(file =>
    readFileSync(join(dir, file), "utf-8"),
  )
}

function isString(value: unknown) {
  return typeof value === "string"
}
