import { join } from "node:path"
import { Command } from "commander"
import { preview as vitePreview } from "vite"

const configFile = join(import.meta.dirname, "..", "website", "vite.config.ts")

/**
 * Preview the production build locally.
 */
export const preview = new Command("preview")
  .description("Preview the production build locally")
  .action(async () => {
    const server = await vitePreview({
      configFile,
      preview: { port: 8000, host: true },
    })
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  })
