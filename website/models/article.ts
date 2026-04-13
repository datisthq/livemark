import { z } from "zod"
import { nonEmptyString } from "../helpers/model.ts"
import type { TocItem } from "./toc.ts"

/** Frontmatter schema for a markdown article. */
export type Article = z.infer<typeof Article>
export const Article = z.object({
  content: z.string(),
  title: nonEmptyString.optional(),
  label: nonEmptyString.optional(),
  description: nonEmptyString.optional(),
  icon: nonEmptyString.optional(),
  order: z.number().optional(),
  pathname: nonEmptyString.optional(),
  group: nonEmptyString.optional(),
  sidebar: z.boolean().default(true),
  toc: z.boolean().default(true),
})

/** Processed article ready for page rendering (result of content-collections transform). */
export interface ArticleView {
  pathname: string
  content: string
  filePath: string
  mdx: string
  tocItems: TocItem[]
  toc?: boolean
  lastUpdated?: string
  sidebar?: boolean
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
