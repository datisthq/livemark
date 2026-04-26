import { cpSync, existsSync, rmSync } from "node:fs"
import { join, sep } from "node:path"
import type {
  ConfigEnv,
  Plugin,
  UserConfig as ViteUserConfig,
  ViteDevServer,
} from "vite"
import { mergeConfig } from "vite"
import { buildTarget } from "../actions/target/build.ts"
import type { Config } from "../models/config.ts"
import { WebsiteConfig } from "../models/config.ts"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../settings.ts"

export interface LivemarkOptions {
  config: Config
}

const SOURCE_DIR = join(import.meta.dirname, "..")

/** Single virtual module exposing livemark's runtime values to consumer
 *  override files via named exports:
 *
 *      import { config } from "livemark:virtual"
 *
 *  Currently exports `config` (validated `WebsiteConfig`); future
 *  additions (e.g. `articles`, `sections`) land here as new named
 *  exports without consumers changing their import statements.
 *
 *  The `\0` prefix on the resolved id is Vite's convention to signal
 *  "this is a virtual module — no other plugin should try to resolve
 *  or load it from disk". */
const VIRTUAL_ID = "livemark:virtual"
const VIRTUAL_RESOLVED_ID = `\0${VIRTUAL_ID}`

/** Owns the per-consumer `targets/<hash>/` mount: synthesizes it via
 *  `buildTarget()`, returns the Vite config that anchors there, and
 *  watches the consumer's `.livemark/` (plus livemark's `source/` in
 *  dev) for changes that need to be re-copied into the target. The
 *  override mechanism is pure file-system (full copies) — no resolveId
 *  redirection, no realpath surprises. */
export function livemark(opts: LivemarkOptions): Plugin {
  const overridesRoot = join(opts.config.root, ".livemark")
  let targetDir = ""
  return {
    name: "livemark",
    enforce: "pre",
    async config(_, env) {
      targetDir = buildTarget(opts.config.configPath)
      const base: ViteUserConfig = {
        root: targetDir,
        // outDir lives outside the target root (in the consumer's
        // .livemark/) so the consumer can find their deployable output
        // without digging into node_modules. Vite's default refusal to
        // empty out-of-root directories doesn't apply here because the
        // target/ root is livemark's, not the consumer's.
        build: { outDir: join(overridesRoot, "build"), emptyOutDir: true },
        resolve: { dedupe: ["react", "react-dom"] },
      }
      const override = await resolveViteOverride(opts.config.vite, env)
      return override ? mergeConfig(base, override) : base
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return VIRTUAL_RESOLVED_ID
      return null
    },
    load(id) {
      if (id !== VIRTUAL_RESOLVED_ID) return null
      const config = WebsiteConfig.parse(opts.config)
      return `export const config = ${JSON.stringify(config)}`
    },
    configureServer(server) {
      server.watcher.add(opts.config.configPath)
      server.watcher.add(join(overridesRoot, "**", "*"))
      server.watcher.add(join(SOURCE_DIR, "**", "*"))

      server.watcher.on("change", file => onChange(file, "change"))
      server.watcher.on("add", file => onChange(file, "add"))
      server.watcher.on("unlink", file => onChange(file, "unlink"))

      function onChange(file: string, kind: "change" | "add" | "unlink") {
        if (file === opts.config.configPath) {
          server.restart()
          return
        }
        const overlayHit = matchOverlay(file, overridesRoot)
        if (overlayHit) {
          syncOverlay(overlayHit, kind, targetDir, overridesRoot)
          if (kind !== "change") fullReload(server)
          return
        }
        const sourceHit = matchSource(file)
        if (sourceHit) {
          syncSource(sourceHit, kind, targetDir, overridesRoot)
          if (kind !== "change") fullReload(server)
        }
      }
    },
  }
}

interface Hit {
  rel: string
  category: "folder" | "file" | null
}

function matchOverlay(file: string, overridesRoot: string): Hit | null {
  const prefix = `${overridesRoot}${sep}`
  if (!file.startsWith(prefix)) return null
  const rel = file.slice(prefix.length)
  return { rel, category: classify(rel) }
}

function matchSource(file: string): Hit | null {
  const prefix = `${SOURCE_DIR}${sep}`
  if (!file.startsWith(prefix)) return null
  // Skip the targets/ output dir itself (sibling of source/) and any
  // `.gen.ts` files that downstream tools regenerate inside the target.
  const rel = file.slice(prefix.length)
  if (rel === "" || rel.includes("routeTree.gen.ts")) return null
  return { rel, category: classify(rel) }
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
    rmSync(dest, { force: true, recursive: true })
    if (existsSync(source))
      cpSync(source, dest, { recursive: true, force: true })
    return
  }
  const overlay = join(overridesRoot, hit.rel)
  if (existsSync(overlay))
    cpSync(overlay, dest, { recursive: true, force: true })
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

function fullReload(server: ViteDevServer) {
  server.ws.send({ type: "full-reload" })
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
