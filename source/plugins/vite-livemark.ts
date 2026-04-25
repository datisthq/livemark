import { existsSync } from "node:fs"
import { join } from "node:path"
import type { Plugin } from "vite"

export interface LivemarkOptions {
  defaultsRoot: string
  overridesRoot: string
  subdirs: string[]
  configPath: string
}

/** Bare specifiers that TanStack Start's compiler tries to resolve from
 *  arbitrary importer files (including transitive packages). Under pnpm's
 *  isolated layout these are unreachable from non-livemark importers, so we
 *  bridge them by re-resolving from livemark's own location. */
const PINNED_SPECIFIERS = ["@tanstack/react-start"] as const

function isPinnedSpecifier(id: string) {
  for (const spec of PINNED_SPECIFIERS) {
    if (id === spec || id.startsWith(`${spec}/`)) return true
  }
  return false
}

/** Livemark dev/build integration:
 * - Redirects imports that land in `<defaultsRoot>/<subdir>/` to the matching
 *   user file under `<overridesRoot>/<subdir>/` when it exists.
 * - Watches `livemark.config.ts` and `.livemark/**` so edits, additions and
 *   deletions trigger the right reload without manual restart. */
export function livemark(opts: LivemarkOptions): Plugin {
  const EXT_RE = /\.(tsx|ts|jsx|js|css)(\?|$)/
  return {
    name: "livemark",
    enforce: "pre",
    async resolveId(id, importer, options) {
      // Pin TanStack's deeply-resolved packages to livemark's own copy so
      // pnpm's isolated layout doesn't strand them when start-compiler-plugin
      // walks transitive package files.
      if (isPinnedSpecifier(id)) {
        const anchor = join(opts.defaultsRoot, "index.ts")
        const resolved = await this.resolve(id, anchor, {
          ...options,
          skipSelf: true,
        })
        if (resolved) return resolved
      }

      if (!importer || !EXT_RE.test(id)) return null
      const resolved = await this.resolve(id, importer, {
        ...options,
        skipSelf: true,
      })
      if (!resolved) return null
      const queryIdx = resolved.id.indexOf("?")
      const path =
        queryIdx === -1 ? resolved.id : resolved.id.slice(0, queryIdx)
      const query = queryIdx === -1 ? "" : resolved.id.slice(queryIdx)
      for (const subdir of opts.subdirs) {
        const defaultsSubdir = `${join(opts.defaultsRoot, subdir)}/`
        if (!path.startsWith(defaultsSubdir)) continue
        const rel = path.slice(defaultsSubdir.length)
        const userPath = join(opts.overridesRoot, subdir, rel)
        if (existsSync(userPath)) return userPath + query
        return null
      }
      return null
    },
    configureServer(server) {
      server.watcher.add(opts.configPath)
      server.watcher.add(join(opts.overridesRoot, "**/*"))

      const overrideRoots = opts.subdirs.map(
        subdir => `${join(opts.overridesRoot, subdir)}/`,
      )
      const routesRoot = `${join(opts.overridesRoot, "routes")}/`

      const onChange = (file: string) => {
        if (file === opts.configPath) {
          server.restart()
          return
        }

        if (file.startsWith(routesRoot)) {
          server.restart()
          return
        }

        for (let i = 0; i < opts.subdirs.length; i++) {
          const root = overrideRoots[i]
          if (!root || !file.startsWith(root)) continue
          const rel = file.slice(root.length)
          const subdir = opts.subdirs[i]
          if (!subdir) continue
          const defaultPath = join(opts.defaultsRoot, subdir, rel)
          const mod = server.moduleGraph.getModuleById(defaultPath)
          if (mod) server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: "full-reload" })
          return
        }
      }

      server.watcher.on("add", onChange)
      server.watcher.on("unlink", onChange)
      server.watcher.on("change", file => {
        if (file === opts.configPath) server.restart()
      })
    },
  }
}
