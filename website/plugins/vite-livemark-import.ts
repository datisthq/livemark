import { existsSync } from "node:fs"
import { join } from "node:path"
import type { Plugin } from "vite"

export interface LivemarkImportOptions {
  defaultsRoot: string
  overridesRoot: string
  subdirs: string[]
}

/** Redirect imports that land in `<defaultsRoot>/<subdir>/` to the same
 * relative path under `<overridesRoot>/<subdir>/` when that file exists. */
export function livemarkImport(opts: LivemarkImportOptions): Plugin {
  const EXT_RE = /\.(tsx|ts|jsx|js|css)(\?|$)/
  return {
    name: "livemark:import",
    enforce: "pre",
    async resolveId(id, importer, options) {
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
  }
}
