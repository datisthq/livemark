import { dirname, resolve } from "node:path"
import type { z } from "zod"
import type { Config } from "../../models/config.ts"
import { UserConfig } from "../../models/config.ts"
import { defineConfig } from "./define.ts"

/**
 * Load and validate a config file, defaulting to livemark.config.ts in cwd.
 */
export async function loadConfig(path?: string): Promise<Config> {
  const resolved = resolve(path ?? "livemark.config.ts")
  const module: Record<string, unknown> = await import(resolved)
  const input = defineConfig(module.default as z.input<typeof UserConfig>)
  return { ...input, root: dirname(resolved) }
}
