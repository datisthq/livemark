import type { z } from "zod"
import { UserConfig } from "../../models/config.ts"

/**
 * Validate and fill defaults for a partial config object.
 */
export function defineConfig(
  input: z.input<typeof UserConfig>,
): z.output<typeof UserConfig> {
  return UserConfig.parse(input)
}
