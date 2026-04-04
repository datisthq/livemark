import { z } from "zod"

/**
 * User-provided configuration for Livemark.
 */
export type UserConfig = z.infer<typeof UserConfig>
export const UserConfig = z.object({
  articles: z.object({
    include: z.union([z.string(), z.array(z.string())]),
    exclude: z.union([z.string(), z.array(z.string())]).optional(),
  }),
})

/**
 * System-computed configuration derived from the config file location.
 */
export type SystemConfig = z.infer<typeof SystemConfig>
export const SystemConfig = z.object({
  root: z.string(),
})

/**
 * Fully resolved Livemark configuration.
 */
export type Config = z.infer<typeof Config>
export const Config = UserConfig.merge(SystemConfig)
