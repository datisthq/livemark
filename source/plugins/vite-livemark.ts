import { cpSync, existsSync, rmSync, statSync } from "node:fs"
import { join, sep } from "node:path"
import { watch as chokidarWatch } from "chokidar"
import type { ConfigEnv, Plugin, UserConfig as ViteUserConfig } from "vite"
import { mergeConfig } from "vite"
import packageJson from "../../package.json" with { type: "json" }
import { buildTarget } from "../actions/target/build.ts"
import { renderInlineMarkdown } from "../helpers/render-inline-markdown.ts"
import { resolveTargetExport } from "../helpers/target-export.ts"
import type { Config } from "../models/config.ts"
import { WebsiteConfig } from "../models/config.ts"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../settings.ts"

export interface LivemarkOptions {
  config: Config
}

const SOURCE_DIR = join(import.meta.dirname, "..")
const IS_INSTALLED = SOURCE_DIR.includes(`${sep}node_modules${sep}`)

/** Single virtual module exposing livemark's runtime values to consumer
 *  override files via named exports:
 *
 *      import { config } from "livemark:virtual"
 *
 *  Currently exports `config` (validated `WebsiteConfig`) and `bannerHtml`
 *  (`config.banner` rendered from inline Markdown at build time); future
 *  additions (e.g. `articles`, `sections`) land here as new named
 *  exports without consumers changing their import statements.
 *
 *  The `\0` prefix on the resolved id is Vite's convention to signal
 *  "this is a virtual module — no other plugin should try to resolve
 *  or load it from disk". */
const VIRTUAL_ID = "livemark:virtual"
const VIRTUAL_RESOLVED_ID = `\0${VIRTUAL_ID}`

/** Owns the project's `.livemark/.target/` mount: synthesizes it via
 *  `buildTarget()`, returns the Vite config that anchors there, and
 *  copies `.livemark/` edits (plus livemark's `source/` in its own dev)
 *  into the target. Vite watches the target natively, so its own HMR
 *  decides between Fast Refresh, CSS updates and a page reload. */
export function livemark(opts: LivemarkOptions): Plugin {
  const overridesRoot = join(opts.config.root, ".livemark")
  const outDir = join(overridesRoot, "build")
  let targetDir = ""
  return {
    name: "livemark",
    enforce: "pre",
    async config(_, env) {
      targetDir = buildTarget({
        configPath: opts.config.configPath,
        sourceDir: SOURCE_DIR,
      })
      const base: ViteUserConfig = {
        root: targetDir,
        // The default `<root>/node_modules/.vite` would land inside the
        // dependency link, i.e. in livemark's shared install.
        cacheDir: join(targetDir, ".vite"),
        // Mount everything (asset URLs, modulepreloads, dev server) under
        // `config.base` so the same build works at root or at a sub-path
        // (e.g. GitHub Pages `https://user.github.io/repo/`). The router
        // and asset-path resolver mirror this at runtime.
        base: opts.config.base ? `${opts.config.base}/` : "/",
        // outDir lives outside the target root, so Vite's refusal to
        // empty out-of-root directories needs `emptyOutDir`.
        build: { outDir, emptyOutDir: true },
        resolve: { dedupe: ["react", "react-dom"] },
        // For the SSR build only, inline every node_modules dep into
        // server.js. The prerender step (which runs server.js with
        // Node) walks node_modules from the build/ dir and can't reach
        // packages buried in pnpm's `.pnpm/*/node_modules/` (e.g.
        // TanStack-internal aliases like `h3-v2`). Self-contained
        // bundle bypasses the issue. Dev SSR keeps externals (faster).
        ...(env.command === "build" && {
          environments: { ssr: { resolve: { noExternal: true } } },
        }),
      }
      const override = await resolveViteOverride(opts.config.vite, env)
      return override ? mergeConfig(base, override) : base
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return VIRTUAL_RESOLVED_ID
      return resolveTargetExport({ id, targetDir, exports: packageJson.exports }) ?? null
    },
    load(id) {
      if (id !== VIRTUAL_RESOLVED_ID) return null
      const config = WebsiteConfig.parse(opts.config)
      const bannerHtml = config.banner
        ? renderInlineMarkdown(config.banner, config.base)
        : undefined
      return [
        `export const config = ${JSON.stringify(config)}`,
        `export const bannerHtml = ${JSON.stringify(bannerHtml)}`,
      ].join("\n")
    },
    configureServer(server) {
      // Vite's own watcher only covers its root (the target); paths added
      // to it from outside the root never fire, so the sources of the
      // target get a watcher of their own. `.livemark/` always exists
      // here because the target lives inside it.
      const paths = [opts.config.configPath, overridesRoot]
      if (!IS_INSTALLED) paths.push(SOURCE_DIR)
      const watcher = chokidarWatch(paths, {
        ignoreInitial: true,
        ignorePermissionErrors: true,
        ignored: path => isWithin(path, targetDir) || isWithin(path, outDir),
      })
      watcher.on("change", file => onChange(file, "change"))
      watcher.on("add", file => onChange(file, "add"))
      watcher.on("unlink", file => onChange(file, "unlink"))
      watcher.on("unlinkDir", file => onChange(file, "unlink"))
      server.httpServer?.once("close", () => {
        watcher.close()
      })

      function onChange(file: string, kind: "change" | "add" | "unlink") {
        if (file === opts.config.configPath) {
          server.restart()
          return
        }
        const overlayHit = matchPath(file, overridesRoot)
        if (overlayHit) {
          syncOverlay(overlayHit, kind, targetDir, overridesRoot)
          return
        }
        const sourceHit = matchPath(file, SOURCE_DIR)
        if (sourceHit && !sourceHit.rel.includes("routeTree.gen.ts")) {
          syncSource(sourceHit, kind, targetDir, overridesRoot)
        }
      }
    },
  }
}

interface Hit {
  rel: string
  category: "folder" | "file" | null
}

function matchPath(file: string, root: string): Hit | null {
  if (!isWithin(file, root) || file === root) return null
  const rel = file.slice(root.length + sep.length)
  return { rel, category: classify(rel) }
}

function isWithin(file: string, dir: string) {
  return file === dir || file.startsWith(`${dir}${sep}`)
}

function classify(rel: string): "folder" | "file" | null {
  const [head] = rel.split(sep)
  if (head && ESCAPABLE_FOLDERS.includes(head)) return "folder"
  if (ESCAPABLE_FILES.includes(rel)) return "file"
  // Non-escapable source files still need to flow into target during
  // livemark's own dev — the user is editing the canonical source.
  return null
}

function syncOverlay(
  hit: Hit,
  kind: "change" | "add" | "unlink",
  targetDir: string,
  overridesRoot: string,
) {
  if (!hit.category) return
  const dest = join(targetDir, hit.rel)
  const source = join(SOURCE_DIR, hit.rel)
  if (kind === "unlink") {
    // Copy a file's default over the escape in one write: an unlink then
    // an add reaches Vite as two events and costs a page reload.
    if (!existsSync(source) || statSync(source).isDirectory()) {
      rmSync(dest, { force: true, recursive: true })
    }
    if (existsSync(source)) cpSync(source, dest, { recursive: true, force: true })
    return
  }
  const overlay = join(overridesRoot, hit.rel)
  if (existsSync(overlay)) cpSync(overlay, dest, { recursive: true, force: true })
}

function syncSource(
  hit: Hit,
  kind: "change" | "add" | "unlink",
  targetDir: string,
  overridesRoot: string,
) {
  // If the consumer has an overlay for this file (and it's escapable),
  // the overlay wins — ignore source changes.
  if (hit.category && existsSync(join(overridesRoot, hit.rel))) return
  const dest = join(targetDir, hit.rel)
  const source = join(SOURCE_DIR, hit.rel)
  if (kind === "unlink") {
    rmSync(dest, { force: true, recursive: true })
    return
  }
  if (existsSync(source)) cpSync(source, dest, { recursive: true, force: true })
}

/** Resolve livemark.config.ts's `vite` field — either a config object
 *  or a function `(env) => config` (matching Vite's own `defineConfig`).
 *  Schema stores it as `unknown`; typing for the consumer's editor
 *  lives on {@link ViteOverride}. */
async function resolveViteOverride(
  vite: unknown,
  env: ConfigEnv,
): Promise<Record<string, unknown> | null> {
  if (!vite) return null
  if (typeof vite === "function") {
    const result = await Reflect.apply(vite, undefined, [env])
    return isObject(result) ? result : null
  }
  return isObject(vite) ? vite : null
}

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object"
}
