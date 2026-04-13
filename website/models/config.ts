import { z } from "zod"

/** Website configuration injected at build time via Vite define */
export type WebsiteConfig = z.infer<typeof WebsiteConfig>
export const WebsiteConfig = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().optional(),
})
