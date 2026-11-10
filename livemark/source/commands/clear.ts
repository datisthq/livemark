import { f } from "fireargs"
import pc from "picocolors"
import { z } from "zod"
import { loadConfig } from "../actions/config/load.ts"
import { clearTarget } from "../actions/target/clear.ts"
import { configInput, helpConfiguration, selectConfig } from "../helpers/program.ts"
import { findLiveServer } from "../helpers/server-lock.ts"

/**
 * Wipe the generated `.livemark/.serve/` and `.livemark/.build/` mounts and `.livemark/.cache/`.
 */
export const clear = f
  .command({
    description: "Wipe the generated .livemark/.serve/, .build/ and .cache/",
    configureHelp: helpConfiguration,
  })
  .input(configInput)
  .output(z.object({ cleared: z.array(z.string()).describe("Directories removed") }))
  .render(output => output.cleared.map(dir => `Cleared ${pc.dim(dir)}`).join("\n"))
  .handler(async input => {
    selectConfig(input.config)
    const config = await loadConfig()
    const server = findLiveServer(config.configPath)
    if (server) {
      throw new Error(
        `Stop livemark start (pid ${server.pid}) first: clearing deletes the files it serves`,
      )
    }
    return { cleared: clearTarget(config.configPath) }
  })
