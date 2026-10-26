import { z } from "zod"
import { Localized } from "./language.ts"

/** Header or sidebar link to an external URL. */
export type Link = z.infer<typeof Link>
export const Link = createLinkSchema(z.string())

/** A link as `livemark.config.ts` declares it: its title may be {@link Localized}. */
export type UserLink = z.infer<typeof UserLink>
export const UserLink = createLinkSchema(Localized)

function createLinkSchema<T extends z.ZodType<Localized>>(text: T) {
  return z.object({
    url: z.string(),
    title: text,
    icon: z.string().optional(),
    prefix: z.string().optional(),
    position: z.enum(["header", "sidebar"]).default("header"),
  })
}
