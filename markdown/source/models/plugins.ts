import type { Pluggable } from "textlane"
import { z } from "zod"

/** Plugins added to the Markdown pipeline: unified-style attachers or native textlane
 *  plugins. `md` runs on the Markdown tree before heading ids and components, `html` on
 *  the HTML tree before heading slugs and the table of contents. */
export type MarkdownPlugins = z.infer<typeof MarkdownPlugins>
export const MarkdownPlugins = z.strictObject({
  md: z.array(z.custom<Pluggable>()).optional(),
  html: z.array(z.custom<Pluggable>()).optional(),
})
