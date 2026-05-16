import { existsSync } from "node:fs"
import { join } from "node:path"
import type { Plugin } from "vite"
import type { Config } from "../models/config.ts"

export interface RobotsOptions {
  config: Config
}

/** Emit a default `robots.txt` into the client build output, with a
 *  `Sitemap:` line pointing at the TanStack-Start-generated `sitemap.xml`
 *  when {@link Config.site} is set. Skipped when the consumer ships
 *  their own `.livemark/public/robots.txt` so the standard publicDir
 *  overlay wins — Vite copies the publicDir before writeBundle, so
 *  unconditional emitFile would silently overwrite the override. */
export function robots(opts: RobotsOptions): Plugin {
  const overrideFile = join(
    opts.config.root,
    ".livemark",
    "public",
    "robots.txt",
  )
  return {
    name: "livemark:robots",
    applyToEnvironment(env) {
      return env.name === "client"
    },
    generateBundle() {
      if (existsSync(overrideFile)) return
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: renderRobots(opts.config),
      })
    },
  }
}

/** Render the body of a permissive default `robots.txt`. A `Sitemap:`
 *  line is appended only when `site` is set, because the directive
 *  requires a fully-qualified URL; `base` is included so the URL matches
 *  where the build (and the `sitemap.xml` inside it) is actually mounted. */
export function renderRobots(config: Pick<Config, "site" | "base">) {
  const lines = ["User-agent: *", "Allow: /"]
  if (config.site) {
    const host = config.site.replace(/\/+$/, "")
    const base = config.base ?? ""
    lines.push("", `Sitemap: ${host}${base}/sitemap.xml`)
  }
  return `${lines.join("\n")}\n`
}
