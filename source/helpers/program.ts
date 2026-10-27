import { resolve } from "node:path"
import type { CommandConfig, CommandContext } from "fireargs"
import { f } from "fireargs"
import pc from "picocolors"
import { z } from "zod"

export const helpConfiguration: CommandConfig["configureHelp"] = {
  styleTitle: str => pc.bold(str.toUpperCase().replace(":", "")),
}

export const configInput = z.object({
  config: f
    .option({ short: "c", env: "LIVEMARK_CONFIG" })
    .schema(z.string().optional())
    .describe("Path to the config file (default: ./livemark.config.ts)"),
})

/** Hand the chosen config to `loadConfig()`, which `vite.config.ts` and
 *  `content-collections.ts` call without arguments. */
export function selectConfig(path?: string) {
  if (path) process.env.LIVEMARK_CONFIG = resolve(path)
}

export function renderError(error: unknown, context: CommandContext) {
  if (!context.json) throw error
  return { error: error instanceof Error ? error.message : String(error) }
}

/** Run `fn` with stdout writes sent to stderr, so build logs cannot corrupt `--json`. */
export async function divertStdout<T>(fn: () => Promise<T>) {
  const write = process.stdout.write
  process.stdout.write = process.stderr.write.bind(process.stderr)
  try {
    return await fn()
  } finally {
    process.stdout.write = write
  }
}

export const serverOutput = z.object({
  local: z.array(z.string()).describe("URLs the server answers on from this machine"),
  network: z.array(z.string()).describe("URLs the server answers on from the network"),
})
