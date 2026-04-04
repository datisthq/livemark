import { Command } from "commander"
import { createServer } from "vite"
import { loadConfig } from "../actions/config/load.ts"
import { toViteConfig } from "../actions/config/toVite.ts"

/**
 * Start a development server.
 */
export const serve = new Command("serve")
  .description("Start a development server")
  .action(async () => {
    const config = await loadConfig()
    const server = await createServer({
      ...toViteConfig(config),
      server: { port: 8000, host: true },
    })
    await server.listen()
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  })
