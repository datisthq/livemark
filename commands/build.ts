import { join } from "node:path"
import { Command } from "commander"
import { build as viteBuild } from "vite"

const root = join(import.meta.dirname, "../website")

/**
 * Build the site for production.
 */
export const build = new Command("build")
  .description("Build the site for production")
  .action(async () => {
    await viteBuild({ root })
  })
