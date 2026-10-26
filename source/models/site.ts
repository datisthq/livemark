import { z } from "zod"
import { WebsiteConfig } from "./config.ts"
import { SiteLanguage } from "./language.ts"
import { Messages } from "./message.ts"

/** One language's view of the site: its config texts, UI strings and banner. */
export type Site = z.infer<typeof Site>
export const Site = z.object({
  language: SiteLanguage,
  config: WebsiteConfig,
  messages: Messages,
  bannerHtml: z.string().optional(),
})
