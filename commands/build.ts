import { Command } from "commander"
import { build as viteBuild } from "vite"

/**
 * Build the site for production.
 */
export const build = new Command("build")
  .description("Build the site for production")
  .action(async () => {
    await viteBuild({
      configFile: "website/vite.config.ts",
    })
  })
