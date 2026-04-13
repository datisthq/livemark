import { z } from "zod"

/** Website configuration injected at build time via Vite define */
export type WebsiteConfig = z.infer<typeof WebsiteConfig>
export const WebsiteConfig = z.object({
  title: z.string(),
  description: z.string(),
  site: z.string().optional(),
  headerLinks: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        icon: z.string().optional(),
      }),
    )
    .optional(),
  sidebarLinks: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        icon: z.string().optional(),
      }),
    )
    .optional(),
})
