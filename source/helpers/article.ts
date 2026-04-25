import type { ArticleGroup, ArticleNode } from "../models/article.ts"

/** Build a tree from a flat sorted list of articles based on path hierarchy */
export function buildArticleTree(
  articles: {
    path: string
    title: string
    label?: string
    icon: string
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

/**
 * Partition root nodes into sidebar sections.
 *
 * Walks root nodes in sort order. A root whose article has a `group` field
 * opens a new section; subsequent roots without `group` append to the current
 * section. Roots before the first `group` field land in a single leading
 * section with `name: undefined` (rendered without a label).
 *
 * `group` on non-root articles is ignored — only roots gate section boundaries.
 */
export function groupArticleTree(
  tree: ArticleNode[],
  articles: { path: string; group?: string }[],
): ArticleGroup[] {
  const groupByPathname = new Map<string, string | undefined>()
  for (const article of articles) {
    groupByPathname.set(article.path, article.group)
  }

  const sections: ArticleGroup[] = []
  let current: ArticleGroup | undefined

  for (const node of tree) {
    const group = groupByPathname.get(node.path)
    if (group) {
      current = { name: group, nodes: [node] }
      sections.push(current)
    } else if (current) {
      current.nodes.push(node)
    } else {
      current = { name: undefined, nodes: [node] }
      sections.push(current)
    }
  }

  return sections
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
