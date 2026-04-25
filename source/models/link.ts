import { z } from "zod"

/** Header or sidebar link to an external URL. */
export type Link = z.infer<typeof Link>
export const Link = z.object({
  url: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  prefix: z.string().optional(),
  position: z.enum(["header", "sidebar"]).default("header"),
})
