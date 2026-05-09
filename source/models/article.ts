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
  path: nonEmptyString.optional(),
  sidebar: z.boolean().default(true),
  toc: z.boolean().default(true),
  image: nonEmptyString.optional(),
  author: z.union([nonEmptyString, z.array(nonEmptyString)]).optional(),
  date: nonEmptyString.optional(),
  tags: z.array(nonEmptyString).optional(),
  sourceUrl: nonEmptyString.optional(),
  sourceAction: z.enum(["edit", "view"]).default("edit"),
})

/** Processed article ready for page rendering (result of content-collections transform). */
export interface ArticleView {
  path: string
  title: string
  content: string
  file: string
  mdx: string
  tocItems: TocItem[]
  toc?: boolean
  lastUpdated?: string
  sidebar?: boolean
  image?: string
  author?: string | string[]
  date?: string
  tags?: string[]
  sourceUrl?: string
  sourceAction?: "edit" | "view"
}

export interface ArticleNode {
  path: string
  title: string
  label?: string
  icon: string
  children: ArticleNode[]
}
