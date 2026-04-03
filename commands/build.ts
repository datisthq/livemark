import { join } from "node:path"
import { Command } from "commander"
import { build as viteBuild } from "vite"

const configFile = join(import.meta.dirname, "../website/vite.config.ts")

/**
 * Build the site for production.
 */
export const build = new Command("build")
  .description("Build the site for production")
  .action(async () => {
    await viteBuild({ configFile })
  })
