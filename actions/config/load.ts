import { dirname, resolve } from "node:path"
import type { z } from "zod"
import type { Config } from "../../models/config.ts"
import { UserConfig } from "../../models/config.ts"
import { defineConfig } from "./define.ts"

/**
 * Load and validate a config file, checking --config/-c CLI arg, then cwd.
 */
export async function loadConfig(path?: string): Promise<Config> {
  const configIndex = process.argv.findIndex(
    a => a === "-c" || a === "--config",
  )
  const cliPath = configIndex !== -1 ? process.argv[configIndex + 1] : undefined
  const resolved = resolve(path ?? cliPath ?? "livemark.config.ts")
  const module: Record<string, unknown> = await import(resolved)
  const input = defineConfig(module.default as z.input<typeof UserConfig>)
  return { ...input, root: dirname(resolved) }
}
