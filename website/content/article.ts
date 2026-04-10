import { allArticles } from "content-collections"
import { buildArticleTree, flattenArticleTree } from "../helpers/article.ts"

/**
 * Articles sorted by frontmatter `order`:
 * positive values first (ascending), then unordered, then negative values
 * (so `order: -1` lands at the very end, `-2` just before it, and so on).
 */
export const sortedArticles = [...allArticles].sort(
  (a, b) => orderKey(a.order) - orderKey(b.order),
)

/** Articles organized as a tree based on pathname hierarchy */
export const articleTree = buildArticleTree(sortedArticles)

/** Articles in depth-first tree order (matches sidebar navigation) */
export const flatArticles = flattenArticleTree(articleTree)

function orderKey(order?: number) {
  if (order === undefined) return Number.MAX_SAFE_INTEGER / 2
  if (order < 0) return Number.MAX_SAFE_INTEGER + order
  return order
}
