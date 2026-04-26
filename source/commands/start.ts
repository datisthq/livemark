import { join } from "node:path"
import { Command } from "commander"
import { createServer } from "vite"

const configFile = join(
  import.meta.dirname,
  "..",
  "..",
  "source",
  "vite.config.ts",
)

/**
 * Start a development server.
 */
export const start = new Command("start")
  .description("Start a live server")
  .option("--clear", "Wipe and fully rebuild the runtime target dir")
  .action(async () => {
    const server = await createServer({
      configFile,
      server: { port: 8000, host: true },
    })
    await server.listen()
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  })
