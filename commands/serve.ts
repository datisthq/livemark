import { Command } from "commander"
import { createServer } from "vite"

/**
 * Start a development server.
 */
export const serve = new Command("serve")
  .description("Start a development server")
  .action(async () => {
    const server = await createServer({
      configFile: "website/vite.config.ts",
      server: { port: 8000, host: true },
    })
    await server.listen()
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  })
