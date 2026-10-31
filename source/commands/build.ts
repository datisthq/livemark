import { join } from "node:path"
import { f } from "fireargs"
import { createBuilder } from "vite"
import { z } from "zod"
import { loadConfig } from "../actions/config/load.ts"
import { pruneSitemap } from "../actions/sitemap/prune.ts"
import { explainPrerenderError } from "../helpers/broken-link.ts"
import {
  configInput,
  createViteLogger,
  divertStdout,
  helpConfiguration,
  selectConfig,
} from "../helpers/program.ts"

const configFile = join(import.meta.dirname, "..", "..", "source", "vite.config.ts")

/**
 * Build the site for production.
 */
export const build = f
  .command({
    description: "Build the site for production",
    configureHelp: helpConfiguration,
  })
  .input(configInput)
  .output(
    z.object({ outDir: z.string().describe("Directory holding the built static site") }),
  )
  .handler(async (input, context) => {
    selectConfig(input.config)
    const config = await loadConfig()
    const outDir = join(config.root, ".livemark", "build", "client")
    const run = async () => {
      const builder = await createBuilder({
        configFile,
        customLogger: createViteLogger(context.json ? "warn" : undefined),
      })
      await builder.buildApp()
    }
    try {
      await catchStrayRejections(() => (context.json ? divertStdout(run) : run()))
    } catch (error) {
      throw explainPrerenderError(error, outDir) ?? error
    }
    if (config.site)
      pruneSitemap({ clientDir: outDir, site: config.site, base: config.base })
    return { outDir }
  })

// TanStack's prerender rejects a crawl task's promise that nothing awaits, so a broken
// link arrives as an unhandled rejection, which Node prints as a crash, not from `run`
async function catchStrayRejections(run: () => Promise<void>) {
  const strays: unknown[] = []
  const collect = (reason: unknown) => strays.push(reason)
  process.on("unhandledRejection", collect)
  try {
    await run()
    // Node reports a rejection as unhandled only once the microtasks have drained
    await new Promise(resolve => setImmediate(resolve))
  } finally {
    process.off("unhandledRejection", collect)
  }
  if (strays.length > 0) throw strays[0]
}
