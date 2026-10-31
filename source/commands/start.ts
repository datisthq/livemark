import { watch } from "node:fs"
import { join } from "node:path"
import { f } from "fireargs"
import { createServer } from "vite"
import type { z } from "zod"
import { resolveConfigPath } from "../actions/config/load.ts"
import { claimServerLock } from "../helpers/server-lock.ts"
import {
  bindShortcuts,
  createViteLogger,
  divertStdout,
  formatError,
  helpConfiguration,
  selectConfig,
  serverInput,
  serverOutput,
} from "../helpers/program.ts"

const configFile = join(import.meta.dirname, "..", "..", "source", "vite.config.ts")
const IGNORED_DIRS = /(^|[/\\])(node_modules|\.git|\.livemark)([/\\]|$)/

/**
 * Start a development server.
 */
export const start = f
  .command({ description: "Start a live server", configureHelp: helpConfiguration })
  .input(serverInput)
  .output(serverOutput)
  .handler(async (input, context) => {
    selectConfig(input.config)
    const lock = claimServerLock(resolveConfigPath())
    process.once("exit", () => lock.release())
    return context.json
      ? divertStdout(() => startServer(true, input, lock))
      : startServer(false, input, lock)
  })

// A broken config fails `createServer` before Vite's watcher exists, so without this
// the process exits and the fix has nobody to pick it up.
async function startServer(
  json: boolean,
  input: Pick<z.infer<typeof serverInput>, "host" | "open">,
  lock: ReturnType<typeof claimServerLock>,
): Promise<z.infer<typeof serverOutput>> {
  try {
    const server = await createServer({
      configFile,
      customLogger: createViteLogger(json ? "warn" : undefined),
      server: { port: 8000, host: input.host, open: input.open ?? false },
    })
    await server.listen()
    lock.announce(server.resolvedUrls?.local[0])
    if (!json) {
      server.printUrls()
      bindShortcuts(server)
    }
    return {
      local: server.resolvedUrls?.local ?? [],
      network: server.resolvedUrls?.network ?? [],
    }
  } catch (error) {
    console.error(formatError(error))
    console.error("\nWaiting for a file change to retry…")
    await waitForChange(process.cwd())
    return await startServer(json, input, lock)
  }
}

function waitForChange(dir: string) {
  return new Promise<void>(resolve => {
    const watcher = watch(dir, { recursive: true, ignore: IGNORED_DIRS }, () => {
      watcher.close()
      resolve()
    })
  })
}
