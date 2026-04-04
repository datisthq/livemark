import { Command } from "commander"
import { build as viteBuild } from "vite"
import { loadConfig } from "../actions/config/load.ts"
import { toViteConfig } from "../actions/config/toVite.ts"

/**
 * Build the site for production.
 */
export const build = new Command("build")
  .description("Build the site for production")
  .action(async () => {
    const config = await loadConfig()
    await viteBuild(toViteConfig(config))
  })
