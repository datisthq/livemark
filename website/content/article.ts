import { allArticles } from "content-collections"
import {
  buildArticleTree,
  flattenArticleTree,
  groupArticleTree,
} from "../helpers/article.ts"

/**
 * Articles sorted by frontmatter `order`:
 * positive values first (ascending), then unordered, then negative values
 * (so `order: -1` lands at the very end, `-2` just before it, and so on).
 */
export const sortedArticles = [...allArticles].sort(
  (a, b) => orderKey(a.order) - orderKey(b.order),
)

/** The first article in sort order, used as the default landing page */
export const firstArticle = sortedArticles[0]

/** The article whose pathname is `/`, if any (rendered in place at the root) */
export const homeArticle = sortedArticles.find(a => a.pathname === "/")

/** Sidebar sections derived from the pathname tree, partitioned by `group` */
export const articleGroups = groupArticleTree(
  buildArticleTree(sortedArticles),
  sortedArticles,
)

/** Articles in depth-first order across all sections (matches sidebar walk) */
export const flatArticles = articleGroups.flatMap(group =>
  flattenArticleTree(group.nodes),
)

function orderKey(order?: number) {
  if (order === undefined) return Number.MAX_SAFE_INTEGER / 2
  if (order < 0) return Number.MAX_SAFE_INTEGER + order
  return order
}
