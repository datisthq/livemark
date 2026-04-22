import { z } from "zod"
import { Article } from "../website/models/article.ts"

/** Per-file override for article frontmatter provided via `livemark.config.ts`. */
export type Patch = z.infer<typeof Patch>
export const Patch = z.object({
  file: z.string(),
  article: Article.omit({ content: true }).partial().strict(),
})
