import { createContext } from "react"

/** The article whose body is rendering, for links relative to its file */
export const ArticleSourceContext = createContext<
  { file: string; language: string } | undefined
>(undefined)

/** An href as rendered outside a Livemark site, where no articles resolve: unchanged. */
export function useArticleHref(href: string | undefined) {
  return href
}
