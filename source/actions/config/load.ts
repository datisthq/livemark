import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import type { Config, UserConfig } from "../../models/config.ts"
import { resolveBase } from "../../helpers/resolve-base.ts"
import { defineConfig } from "./define.ts"

/** Map livemark CLI verbs to the Vite-equivalent `command` string used by
 *  `resolveBase()`. `preview` serves the production build's artifacts so
 *  it uses the build-mode base. Default to `"build"` for safety when no
 *  recognised verb is in argv (the common path is `livemark <verb> ...`). */
const COMMAND_BY_VERB: Record<string, "build" | "serve"> = {
  start: "serve",
  build: "build",
  preview: "build",
}

function detectCommand() {
  for (const arg of process.argv.slice(2)) {
    if (arg in COMMAND_BY_VERB) return COMMAND_BY_VERB[arg]!
  }
  return "build" as const
}

/**
 * Load and validate a config file, checking --config/-c CLI arg, then cwd.
 *
 * If a path is provided explicitly (arg or `--config`/`-c`) and the
 * file is missing, throws — the user asked for a specific config and
 * it isn't there. If no path is provided and no `livemark.config.ts`
 * exists in cwd, falls back to the default config with a synthesized
 * `configPath = <cwd>/livemark.config.ts` so downstream code (target
 * hash, watcher) still has a stable per-project key.
 */
export async function loadConfig(path?: string): Promise<Config> {
  const configIndex = process.argv.findIndex(
    a => a === "-c" || a === "--config",
  )
  const cliPath = configIndex !== -1 ? process.argv[configIndex + 1] : undefined
  const explicit = path ?? cliPath
  const resolved = resolve(explicit ?? "livemark.config.ts")
  let input: UserConfig = {}
  if (existsSync(resolved)) {
    // Cache-bust the ESM import so dev-server restart reloads edits on disk.
    const url = `${pathToFileURL(resolved).href}?t=${Date.now()}`
    const module: Record<string, unknown> = await import(url)
    input = (module.default as UserConfig) ?? {}
  } else if (explicit) {
    throw new Error(`Config file not found: ${resolved}`)
  }
  const validated = defineConfig(input)
  // Resolve the function form of `base` once, here, using the livemark
  // CLI verb. Downstream consumers (Vite plugin, content-collections,
  // runtime) get a plain string|undefined and never see the function.
  const base = resolveBase(validated.base, detectCommand())
  return { ...validated, base, root: dirname(resolved), configPath: resolved }
}
