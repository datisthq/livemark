import { Command } from "commander"
import pc from "picocolors"
import { loadConfig } from "../actions/config/load.ts"
import { clearTarget } from "../actions/target/clear.ts"

/**
 * Wipe the generated `.livemark/.serve/` and `.livemark/.build/` mounts and `.livemark/.cache/`.
 */
export const clear = new Command("clear")
  .description("Wipe the generated .livemark/.serve/, .build/ and .cache/")
  .action(async () => {
    const config = await loadConfig()
    for (const targetDir of clearTarget(config.configPath)) {
      console.log(`Cleared ${pc.dim(targetDir)}`)
    }
  })
