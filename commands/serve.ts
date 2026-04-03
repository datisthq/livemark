import { join } from "node:path"
import { Command } from "commander"
import { createServer } from "vite"

const root = join(import.meta.dirname, "../website")

/**
 * Start a development server.
 */
export const serve = new Command("serve")
  .description("Start a development server")
  .action(async () => {
    const server = await createServer({
      root,
      server: { port: 8000, host: true },
    })
    await server.listen()
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  })
