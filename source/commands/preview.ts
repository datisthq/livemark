import { join } from "node:path"
import { f } from "fireargs"
import { preview as vitePreview } from "vite"
import {
  bindShortcuts,
  divertStdout,
  selectConfig,
  serverInput,
  serverOutput,
} from "../helpers/program.ts"

const configFile = join(import.meta.dirname, "..", "..", "source", "vite.config.ts")

/**
 * Preview the production build locally.
 */
export const preview = f
  .command({ description: "Preview the production build locally" })
  .input(serverInput)
  .output(serverOutput)
  .handler(async (input, context) => {
    selectConfig(input.config)
    const run = () =>
      vitePreview({
        configFile,
        logLevel: context.json ? "warn" : undefined,
        preview: { port: 8000, host: input.host, open: input.open ?? false },
      })
    const server = await (context.json ? divertStdout(run) : run())
    if (!context.json) {
      server.printUrls()
      bindShortcuts(server)
    }
    return {
      local: server.resolvedUrls?.local ?? [],
      network: server.resolvedUrls?.network ?? [],
    }
  })
