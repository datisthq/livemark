import { UserConfig as UserConfigSchema } from "../../models/config.ts"
import type { UserConfig } from "../../models/config.ts"

/**
 * Validate and fill defaults for a partial config object.
 */
export function defineConfig(input: UserConfig) {
  return UserConfigSchema.parse(input)
}
