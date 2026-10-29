import { watch } from "node:fs"
import { join } from "node:path"
import { f } from "fireargs"
import { createServer } from "vite"
import type { z } from "zod"
import {
  divertStdout,
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
  .command({ description: "Start a live server" })
  .input(serverInput)
  .output(serverOutput)
  .handler(async (input, context) => {
    selectConfig(input.config)
    return context.json
      ? divertStdout(() => startServer(true, input.host))
      : startServer(false, input.host)
  })

// A broken config fails `createServer` before Vite's watcher exists, so without this
// the process exits and the fix has nobody to pick it up.
async function startServer(
  json: boolean,
  host: boolean,
): Promise<z.infer<typeof serverOutput>> {
  try {
    const server = await createServer({
      configFile,
      logLevel: json ? "warn" : undefined,
      server: { port: 8000, host },
    })
    await server.listen()
    if (!json) {
      server.printUrls()
      server.bindCLIShortcuts({ print: true })
    }
    return {
      local: server.resolvedUrls?.local ?? [],
      network: server.resolvedUrls?.network ?? [],
    }
  } catch (error) {
    console.error(error)
    console.error("\nWaiting for a file change to retry…")
    await waitForChange(process.cwd())
    return await startServer(json, host)
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
