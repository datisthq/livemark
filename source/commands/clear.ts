import { Command } from "commander"
import pc from "picocolors"
import { loadConfig } from "../actions/config/load.ts"
import { clearTarget } from "../actions/target/clear.ts"

/**
 * Wipe the cached runtime target dir.
 */
export const clear = new Command("clear")
  .description("Wipe the cached runtime target dir")
  .action(async () => {
    const config = await loadConfig()
    const targetDir = clearTarget(config.configPath)
    console.log(`Cleared ${pc.dim(targetDir)}`)
  })
