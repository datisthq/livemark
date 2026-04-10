import { allArticles } from "content-collections"
import { buildArticleTree, flattenArticleTree } from "../helpers/article.ts"

/** Articles sorted by frontmatter order (unordered articles come last) */
export const sortedArticles = [...allArticles].sort((a, b) => {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER
  const bo = b.order ?? Number.MAX_SAFE_INTEGER
  return ao - bo
})

/** Articles organized as a tree based on pathname hierarchy */
export const articleTree = buildArticleTree(sortedArticles)

/** Articles in depth-first tree order (matches sidebar navigation) */
export const flatArticles = flattenArticleTree(articleTree)
