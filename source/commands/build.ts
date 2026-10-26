import { join } from "node:path"
import { Command } from "commander"
import { createBuilder } from "vite"
import { loadConfig } from "../actions/config/load.ts"
import { pruneSitemap } from "../actions/sitemap/prune.ts"

const configFile = join(import.meta.dirname, "..", "..", "source", "vite.config.ts")

/**
 * Build the site for production.
 */
export const build = new Command("build")
  .description("Build the site for production")
  .action(async () => {
    const builder = await createBuilder({ configFile })
    await builder.buildApp()
    const config = await loadConfig()
    if (!config.site) return
    pruneSitemap({
      clientDir: join(config.root, ".livemark", "build", "client"),
      site: config.site,
      base: config.base,
    })
  })
