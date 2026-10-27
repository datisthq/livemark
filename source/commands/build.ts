import { join } from "node:path"
import { f } from "fireargs"
import { createBuilder } from "vite"
import { z } from "zod"
import { loadConfig } from "../actions/config/load.ts"
import { pruneSitemap } from "../actions/sitemap/prune.ts"
import { configInput, divertStdout, selectConfig } from "../helpers/program.ts"

const configFile = join(import.meta.dirname, "..", "..", "source", "vite.config.ts")

/**
 * Build the site for production.
 */
export const build = f
  .command({ description: "Build the site for production" })
  .input(configInput)
  .output(
    z.object({ outDir: z.string().describe("Directory holding the built static site") }),
  )
  .handler(async (input, context) => {
    selectConfig(input.config)
    const run = async () => {
      const builder = await createBuilder({
        configFile,
        logLevel: context.json ? "warn" : undefined,
      })
      await builder.buildApp()
    }
    await (context.json ? divertStdout(run) : run())
    const config = await loadConfig()
    const outDir = join(config.root, ".livemark", "build", "client")
    if (config.site)
      pruneSitemap({ clientDir: outDir, site: config.site, base: config.base })
    return { outDir }
  })
