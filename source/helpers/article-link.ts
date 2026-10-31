import { createContext, useContext } from "react"
import { sortedArticles } from "../content/article.ts"
import { resolveMarkdownLink } from "./markdown-link.ts"

/** The article whose body is rendering, for links relative to its file */
export const ArticleSourceContext = createContext<
  { file: string; language: string } | undefined
>(undefined)

/** An href as the site serves it: a relative link to a Markdown file becomes the
 *  URL of the article built from that file; any other href is kept. */
export function useArticleHref(href: string | undefined) {
  const source = useContext(ArticleSourceContext)
  if (!href || !source) return href
  return resolveMarkdownLink({ href, ...source, articles: sortedArticles }) ?? href
}
