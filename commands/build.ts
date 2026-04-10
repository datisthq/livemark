import { join } from "node:path"
import { Command } from "commander"
import { createBuilder } from "vite"

const configFile = join(import.meta.dirname, "..", "website", "vite.config.ts")

/**
 * Build the site for production.
 */
export const build = new Command("build")
  .description("Build the site for production")
  .action(async () => {
    const builder = await createBuilder({ configFile })
    await builder.buildApp()
  })
