import type { z } from "zod"
import { UserConfig } from "../../models/config.ts"

/** Website configuration injected at build time via Vite define */
export type WebsiteConfig = z.infer<typeof WebsiteConfig>
export const WebsiteConfig = UserConfig.pick({
  title: true,
  description: true,
  site: true,
  headerLinks: true,
  sidebarLinks: true,
})
