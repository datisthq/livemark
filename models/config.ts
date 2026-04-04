import { z } from "zod"

/**
 * A project configuration for Livemark.
 */
export type Config = z.infer<typeof Config>
export const Config = z.object({
  docs: z.object({
    folders: z.array(z.string()),
  }),
})
