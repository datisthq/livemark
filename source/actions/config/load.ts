import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import type { z } from "zod"
import type { Config } from "../../models/config.ts"
import { UserConfig } from "../../models/config.ts"
import { defineConfig } from "./define.ts"

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
  let input: z.input<typeof UserConfig> = {}
  if (existsSync(resolved)) {
    // Cache-bust the ESM import so dev-server restart reloads edits on disk.
    const url = `${pathToFileURL(resolved).href}?t=${Date.now()}`
    const module: Record<string, unknown> = await import(url)
    input = (module.default as z.input<typeof UserConfig>) ?? {}
  } else if (explicit) {
    throw new Error(`Config file not found: ${resolved}`)
  }
  const validated = defineConfig(input)
  return { ...validated, root: dirname(resolved), configPath: resolved }
}
