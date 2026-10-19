import type { ArticleNode } from "../models/article.ts"

/** Build a tree from a flat sorted list of articles based on path hierarchy */
export function buildArticleTree(
  articles: {
    path: string
    title: string
    label?: string
    icon?: string
  }[],
) {
  const nodeMap = new Map<string, ArticleNode>()

  for (const article of articles) {
    nodeMap.set(article.path, {
      path: article.path,
      title: article.title,
      label: article.label,
      icon: article.icon,
      children: [],
    })
  }

  const roots: ArticleNode[] = []

  for (const article of articles) {
    const node = nodeMap.get(article.path)
    if (!node) continue
    const trimmed = article.path.replace(/\/$/, "")
    const lastSlash = trimmed.lastIndexOf("/")
    const parentPath = lastSlash > 0 ? `${trimmed.slice(0, lastSlash)}/` : ""
    const parent = parentPath ? nodeMap.get(parentPath) : undefined

    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

/** Depth-first flatten of an article tree into a list of paths */
export function flattenArticleTree(nodes: ArticleNode[]) {
  const result: string[] = []
  for (const node of nodes) {
    result.push(node.path)
    result.push(...flattenArticleTree(node.children))
  }
  return result
}

/** Sort comparator on frontmatter `order`: positive ascending, then unordered,
 *  then negative (so `order: -1` lands last) */
export function compareArticleOrder(a: { order?: number }, b: { order?: number }) {
  return orderKey(a.order) - orderKey(b.order)
}

/** Sort comparator putting the newest `date` first, as blog and changelog list */
export function compareArticleDate(a: { date?: string }, b: { date?: string }) {
  return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
}

function orderKey(order?: number) {
  if (order === undefined) return Number.MAX_SAFE_INTEGER / 2
  if (order < 0) return Number.MAX_SAFE_INTEGER + order
  return order
}
