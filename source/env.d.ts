declare module "livemark:virtual" {
  export const config: import("./models/config.ts").WebsiteConfig
  export const bannerHtml: string | undefined
  export const sites: readonly [
    import("./models/site.ts").Site,
    ...import("./models/site.ts").Site[],
  ]
}

declare module "livemark:articles" {
  type Frontmatter = import("./models/article.ts").Article
  type TocItem = import("./models/toc.ts").TocItem

  /** An article as every page sees it: no body, no search text. */
  export type ArticleEntry = Omit<
    Frontmatter,
    "content" | "title" | "path" | "language"
  > & {
    path: string
    key: string
    language: string
    title: string
    file: string
    lastUpdated?: string
  }
  /** The fields only the article's own page loads. */
  export interface ArticleBody {
    mdx: string
    content: string
    tocItems: TocItem[]
  }

  export const articles: ArticleEntry[]
  export const bodies: Record<string, () => Promise<{ default: ArticleBody }>>
  export const searchIndexes: Record<
    string,
    () => Promise<{ default: { path: string; searchText: string }[] }>
  >
}
