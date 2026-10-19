import { Command } from "commander"
import pc from "picocolors"
import { loadConfig } from "../actions/config/load.ts"
import { clearTarget } from "../actions/target/clear.ts"

/**
 * Wipe the generated `.livemark/.target/` mount.
 */
export const clear = new Command("clear")
  .description("Wipe the generated .livemark/.target/ mount")
  .action(async () => {
    const config = await loadConfig()
    const targetDir = clearTarget(config.configPath)
    console.log(`Cleared ${pc.dim(targetDir)}`)
  })
