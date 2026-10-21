import { existsSync, watch, type FSWatcher } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { createBuilder } from "@content-collections/core"
import { configureLogging } from "@content-collections/integrations"
import type { Plugin } from "vite"
import { createTaskQueue } from "../helpers/task-queue.ts"

export interface ContentOptions {
  configPath: string
  contentDir: string
}

type Builder = Awaited<ReturnType<typeof createBuilder>>

const IGNORED_PATHS = /(^|[/\\])(node_modules|\.[^/\\]+)([/\\]|$)/

/** Build the content collections and rebuild them on edits, one build at a time:
 *  `@content-collections/vite` builds per file event, a save fires two, and their
 *  overlapping writes tore `allArticles.js` so every request failed. */
export function content(opts: ContentOptions): Plugin {
  const queue = createTaskQueue({ onError: error => console.error(error) })
  let builder: Builder | undefined
  let initialBuild: Promise<void> | undefined
  let watcher: FSWatcher | undefined
  return {
    name: "livemark:content",
    config(config) {
      const configPath = resolve(config.root ?? process.cwd(), opts.configPath)
      const generated = join(dirname(configPath), ".content-collections", "generated")
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
