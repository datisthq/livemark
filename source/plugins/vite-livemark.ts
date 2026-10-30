import {
  cpSync,
  existsSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, sep } from "node:path"
import type { ConfigEnv, Plugin, UserConfig as ViteUserConfig, ViteDevServer } from "vite"
import { mergeConfig } from "vite"
import packageJson from "../../package.json" with { type: "json" }
import { buildTarget, ESM_PACKAGE_JSON } from "../actions/target/build.ts"
import { renderInlineMarkdown } from "../helpers/render-inline-markdown.ts"
import { excludeTailwindSources } from "../helpers/tailwind-sources.ts"
import { buildSites } from "../helpers/site.ts"
import { resolveTargetExport } from "../helpers/target-export.ts"
import type { Config } from "../models/config.ts"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../settings.ts"

export interface LivemarkOptions {
  config: Config
}

const SOURCE_DIR = join(import.meta.dirname, "..")
const IS_INSTALLED = SOURCE_DIR.includes(`${sep}node_modules${sep}`)
const LOCKFILES = [
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
]

/** Single virtual module exposing livemark's runtime values to consumer
 *  override files via named exports:
 *
 *      import { config } from "livemark:virtual"
 *
 *  Exports `config` (the default language's `WebsiteConfig`), `bannerHtml`
 *  (its `banner` rendered from inline Markdown at build time) and `sites`
 *  (every language's config, messages and banner, the default first); future
 *  additions land here as new named exports without consumers changing their
 *  import statements.
 *
 *  The `\0` prefix on the resolved id is Vite's convention to signal
 *  "this is a virtual module — no other plugin should try to resolve
 *  or load it from disk". */
const VIRTUAL_ID = "livemark:virtual"
const VIRTUAL_RESOLVED_ID = `\0${VIRTUAL_ID}`

/** Owns the project's `.livemark/.serve/` mount (`.build/` when building, so a build
 *  never rewrites a running dev server's files): synthesizes it via
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
        command: env.command === "build" || env.isPreview ? "build" : "serve",
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
    // The prerender imports the server bundle with Node, which would read it as
    // CommonJS under a `"type": "commonjs"` project. Written, not emitted: an SSR
    // build drops emitted assets.
    writeBundle(options) {
      if (this.environment.name !== "ssr" || !options.dir) return
      writeFileSync(join(options.dir, "package.json"), ESM_PACKAGE_JSON)
    },
    // Here, not in `styles/general.css`, so an escaped stylesheet keeps it. Works only
    // while this plugin precedes `tailwind()`: both are `pre`, so array order decides.
    transform: {
      filter: { id: /\.css(\?|$)/ },
      handler(css) {
        return excludeTailwindSources({ css, targetDir })
      },
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return VIRTUAL_RESOLVED_ID
      return resolveTargetExport({ id, targetDir, exports: packageJson.exports }) ?? null
    },
    load(id) {
      if (id !== VIRTUAL_RESOLVED_ID) return null
      const sites = buildSites(opts.config).map(site => ({
        ...site,
        bannerHtml: site.config.banner
          ? renderInlineMarkdown(site.config.banner, site.config.base)
          : undefined,
      }))
      return [
        `export const sites = ${JSON.stringify(sites)}`,
        "export const config = sites[0].config",
        "export const bannerHtml = sites[0].bannerHtml",
      ].join("\n")
    },
    configureServer(server) {
      // Vite restarts only for its own config's imports; the project config's
      // imports need it too. A restart rebuilds the target, so no sync is lost.
      const restartFiles = new Set([
        opts.config.configPath,
        ...opts.config.configDependencies,
      ])
      // Vite watches only its root (the target); the files the target is
      // copied from join its watcher here. `.livemark/` always exists
      // because the target lives inside it.
      server.watcher.add([...restartFiles, overridesRoot])
      if (IS_INSTALLED) watchInstalledVersion(server, opts.config.root)
      else server.watcher.add(SOURCE_DIR)
      server.watcher.on("change", file => onChange(file, "change"))
      server.watcher.on("add", file => onChange(file, "add"))
      server.watcher.on("unlink", file => onChange(file, "unlink"))
      server.watcher.on("unlinkDir", file => onChange(file, "unlink"))

      function onChange(file: string, kind: "change" | "add" | "unlink") {
        if (restartFiles.has(file)) {
          server.restart()
          return
        }
        if (isWithin(file, targetDir) || isWithin(file, outDir)) return
        // A watcher callback that throws kills the server, and a copy racing another
        // writer of the target (an editor's atomic save, `livemark clear`) fails.
        try {
          const overlayHit = matchPath(file, overridesRoot)
          if (overlayHit) {
            syncOverlay(overlayHit, kind, targetDir, overridesRoot)
            return
          }
          const sourceHit = matchPath(file, SOURCE_DIR)
          if (sourceHit && !sourceHit.rel.includes("routeTree.gen.ts")) {
            syncSource(sourceHit, kind, targetDir, overridesRoot)
          }
        } catch (error) {
          server.config.logger.error(`[livemark] failed to sync ${file}: ${error}`, {
            error: error instanceof Error ? error : undefined,
          })
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

// A running server keeps the livemark it started with: an in-process restart cannot
// reload the package's own modules, so an upgrade is reported instead.
function watchInstalledVersion(server: ViteDevServer, root: string) {
  const packageDir = findInstalledPackageDir(root)
  if (!packageDir) return
  // Vite's watcher ignores node_modules, so the lockfile is what signals an install.
  const projectDir = dirname(dirname(packageDir))
  const manifest = join(packageDir, "package.json")
  const watched = LOCKFILES.map(name => join(projectDir, name))
  server.watcher.add(watched)
  let timer: NodeJS.Timeout | undefined
  server.watcher.on("all", (_, file) => {
    if (!watched.includes(file)) return
    clearTimeout(timer)
    // Let the package manager finish relinking after it writes the lockfile.
    timer = setTimeout(reportUpgrade, 1000)
  })

  function reportUpgrade() {
    const version = readPackageVersion(manifest)
    if (!version || version === packageJson.version) return
    server.config.logger.warn(
      `livemark ${packageJson.version} → ${version} installed; restart the dev server to use it`,
      { timestamp: true },
    )
  }
}

function findInstalledPackageDir(root: string) {
  for (let dir = root; ; dir = dirname(dir)) {
    const packageDir = join(dir, "node_modules", packageJson.name)
    if (existsSync(packageDir)) return packageDir
    if (dirname(dir) === dir) return undefined
  }
}

function readPackageVersion(manifest: string) {
  try {
    const parsed: unknown = JSON.parse(readFileSync(manifest, "utf8"))
    return isObject(parsed) && typeof parsed.version === "string"
      ? parsed.version
      : undefined
  } catch {
    return undefined
  }
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
