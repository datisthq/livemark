import { z } from "zod"
import { nonEmptyString } from "../helpers/model.ts"
import { MessageOverrides } from "./message.ts"

/** A text in the default language, or one per language code. */
export type Localized = z.infer<typeof Localized>
export const Localized = z.union([z.string(), z.record(z.string(), z.string())])

/** A site language; the first in `languages` is the default and is served unprefixed. */
export type Language = z.infer<typeof Language>
export const Language = z.object({
  code: z.string().regex(/^[a-z][a-z0-9-]*$/, "use a lowercase URL segment like `es`"),
  label: nonEmptyString,
  locale: nonEmptyString.optional(),
  dir: z.enum(["ltr", "rtl"]).optional(),
  messages: MessageOverrides.optional(),
})

/** A language as the runtime sees it: defaults filled and its URL prefix resolved. */
export type SiteLanguage = z.infer<typeof SiteLanguage>
export const SiteLanguage = z.object({
  code: z.string(),
  label: z.string(),
  locale: z.string(),
  dir: z.enum(["ltr", "rtl"]),
  prefix: z.string(),
  default: z.boolean(),
})
