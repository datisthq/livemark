import { allArticles } from "content-collections"
import { buildArticleTree, type ArticleNode } from "../models/article.ts"

/** Articles sorted by frontmatter order (unordered articles come last) */
export const sortedArticles = [...allArticles].sort((a, b) => {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER
  const bo = b.order ?? Number.MAX_SAFE_INTEGER
  return ao - bo
})

/** Articles organized as a tree based on pathname hierarchy */
export const articleTree = buildArticleTree(sortedArticles)

/** Articles in depth-first tree order (matches sidebar navigation) */
export const flatArticles = flattenTree(articleTree)

function flattenTree(nodes: ArticleNode[]) {
  const result: string[] = []
  for (const node of nodes) {
    result.push(node.pathname)
    result.push(...flattenTree(node.children))
  }
  return result
}
