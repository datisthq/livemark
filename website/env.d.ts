interface ImportMetaEnv {
  readonly CONFIG: import("./models/config.ts").WebsiteConfig
}

declare module "content-collections" {
  import type configuration from "./content-collections.ts"
  import type { GetTypeByName } from "@content-collections/core"

  type Article = GetTypeByName<typeof configuration, "articles">
  const allArticles: Array<Article>

  export { allArticles }
  export type { Article }
}
