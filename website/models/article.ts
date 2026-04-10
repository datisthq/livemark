import { z } from "zod"

/** Frontmatter schema for a markdown article. */
export type Article = z.infer<typeof Article>
export const Article = z.object({
  content: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  pathname: z.string().optional(),
})

export interface ArticleNode {
  pathname: string
  title: string
  icon: string
  children: ArticleNode[]
}
