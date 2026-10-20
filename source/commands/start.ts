import { watch } from "node:fs"
import { join } from "node:path"
import { Command } from "commander"
import { createServer } from "vite"

const configFile = join(import.meta.dirname, "..", "..", "source", "vite.config.ts")
const IGNORED_DIRS = /(^|[/\\])(node_modules|\.git|\.livemark)([/\\]|$)/

/**
 * Start a development server.
 */
export const start = new Command("start")
  .description("Start a live server")
  .action(async () => {
    await startServer()
  })

// A broken config fails `createServer` before Vite's watcher exists, so without this
// the process exits and the fix has nobody to pick it up.
async function startServer() {
  try {
    const server = await createServer({
      configFile,
      server: { port: 8000, host: true },
    })
    await server.listen()
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  } catch (error) {
    console.error(error)
    console.error("\nWaiting for a file change to retry…")
    await waitForChange(process.cwd())
    await startServer()
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
