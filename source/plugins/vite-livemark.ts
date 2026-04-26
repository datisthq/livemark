import { cpSync, existsSync, rmSync } from "node:fs"
import { join, sep } from "node:path"
import type { Plugin, ViteDevServer } from "vite"
import { buildTarget } from "../actions/target/build.ts"
import type { Config } from "../models/config.ts"
import { WebsiteConfig } from "../models/config.ts"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../settings.ts"

export interface LivemarkOptions {
  config: Config
}

const SOURCE_DIR = join(import.meta.dirname, "..")

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
    config() {
      targetDir = buildTarget(opts.config.configPath)
      return {
        root: targetDir,
        // outDir lives outside the target root (in the consumer's
        // .livemark/) so the consumer can find their deployable output
        // without digging into node_modules. Vite's default refusal to
        // empty out-of-root directories doesn't apply here because the
        // target/ root is livemark's, not the consumer's.
        build: { outDir: join(overridesRoot, "build"), emptyOutDir: true },
        define: {
          "import.meta.env.CONFIG": JSON.stringify(
            WebsiteConfig.parse(opts.config),
          ),
        },
        resolve: { dedupe: ["react", "react-dom"] },
      }
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
