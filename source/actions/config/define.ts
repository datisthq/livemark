import { UserConfig as UserConfigSchema } from "../../models/config.ts"
import type { UserConfig } from "../../models/config.ts"
import { assertLanguagePrefixes } from "../../helpers/site.ts"

/**
 * Validate and fill defaults for a partial config object.
 */
export function defineConfig(input: UserConfig) {
  const config = UserConfigSchema.parse(input)
  assertLanguagePrefixes(config)
  return config
}
