declare module "livemark:virtual" {
  export const config: import("./models/config.ts").WebsiteConfig
  export const bannerHtml: string | undefined
  export const sites: readonly [
    import("./models/site.ts").Site,
    ...import("./models/site.ts").Site[],
  ]
}

declare module "content-collections" {
  import type configuration from "./content-collections.ts"
  import type { GetTypeByName } from "@content-collections/core"

  type Article = GetTypeByName<typeof configuration, "articles">
  const allArticles: Array<Article>

  export { allArticles }
  export type { Article }
}
