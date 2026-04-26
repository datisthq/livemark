import { createHash } from "node:crypto"
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../../settings.ts"

// This file ships at <livemark-pkg>/source/actions/target/build.ts AND
// gets copied into <livemark-pkg>/targets/<hash>/actions/target/build.ts
// as part of every per-consumer mount. content-collections loads the
// COPIED version, so `import.meta.dirname` can land inside `targets/`.
// Walk up to the first directory holding livemark's `package.json` so
// SOURCE_DIR / TARGETS_ROOT always anchor at the package, never at a
// per-consumer dir.
const LIVEMARK_PKG = findLivemarkPkg(import.meta.dirname)
const SOURCE_DIR = join(LIVEMARK_PKG, "source")
const TARGETS_ROOT = join(LIVEMARK_PKG, "targets")

function findLivemarkPkg(start: string) {
  let cur = start
  while (cur !== dirname(cur)) {
    if (existsSync(join(cur, "package.json"))) return cur
    cur = dirname(cur)
  }
  throw new Error(`Could not locate livemark package root from ${start}`)
}

/**
 * Synthesize a fully self-contained per-consumer Vite mount at
 * `<livemark-pkg>/targets/<hash>/`.
 *
 * The mount is built by copying livemark's `source/` wholesale, then
 * overlaying any matching files from the consumer's `.livemark/`. Every
 * file lives at its target path as a real file — no symlinks — so
 * Vite's relative-import and bare-specifier resolution all anchor
 * inside the target dir, where node_modules walks reach livemark's pnpm
 * subtree natively.
 *
 * Behavior:
 * - First run (target dir missing): full source copy + overlay.
 * - Subsequent runs: skip the source copy. Source is immutable in
 *   installed mode; in livemark's own dev the watcher keeps the target
 *   in sync. Only the `.livemark/` overlay is re-applied each time —
 *   cheap, and may have changed between runs.
 * - With `--clear` in argv: wipe the entire target dir (including
 *   downstream caches like `.vite/`, `.content-collections/`,
 *   `cache/`, `routeTree.gen.ts`) and rebuild from scratch. Use this
 *   to recover from a stale or corrupted cache.
 *
 * Returns the absolute path to the target dir.
 */
export function buildTarget(configPath: string) {
  const targetDir = targetDirFor(configPath)
  const overridesRoot = join(dirname(configPath), ".livemark")
  const clear = process.argv.includes("--clear")

  if (clear) rmSync(targetDir, { recursive: true, force: true })

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
    cpSync(SOURCE_DIR, targetDir, { recursive: true })
  }

  for (const folder of ESCAPABLE_FOLDERS) {
    const overlay = join(overridesRoot, folder)
    if (!existsSync(overlay)) continue
    const dest = join(targetDir, folder)
    if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
    for (const f of readdirSync(overlay)) {
      cpSync(join(overlay, f), join(dest, f), { recursive: true, force: true })
    }
  }
  for (const file of ESCAPABLE_FILES) {
    const overlay = join(overridesRoot, file)
    if (!existsSync(overlay)) continue
    cpSync(overlay, join(targetDir, file), { force: true })
  }

  return targetDir
}

/** Compute the target dir for a given consumer config path without
 *  rebuilding it. Used by code that needs to write into the target
 *  (e.g. cache writers) outside of `buildTarget`'s setup phase. */
export function targetDirFor(configPath: string) {
  const hash = createHash("sha256")
    .update(configPath)
    .digest("hex")
    .slice(0, 16)
  return join(TARGETS_ROOT, hash)
}
