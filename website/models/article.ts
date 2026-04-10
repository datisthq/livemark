import { z } from "zod"
import type { TocItem } from "./toc.ts"

/** Frontmatter schema for a markdown article. */
export type Article = z.infer<typeof Article>
export const Article = z.object({
  content: z.string(),
  title: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  pathname: z.string().optional(),
  group: z.string().optional(),
})

/** Processed article ready for page rendering (result of content-collections transform). */
export interface ArticleView {
  pathname: string
  content: string
  filePath: string
  mdx: string
  toc: TocItem[]
  lastUpdated?: string
}

export interface ArticleNode {
  pathname: string
  title: string
  label?: string
  icon: string
  children: ArticleNode[]
}

/**
 * A contiguous section of root articles sharing the same `group` label.
 * `name: undefined` represents the leading ungrouped section (at most one).
 */
export interface ArticleGroup {
  name?: string
  nodes: ArticleNode[]
}
