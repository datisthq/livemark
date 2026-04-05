export interface ArticleNode {
  pathname: string
  title: string
  icon: string
  children: ArticleNode[]
}

/** Build a tree from a flat sorted list of articles based on pathname hierarchy */
export function buildArticleTree(
  articles: { pathname: string; title: string; icon: string }[],
) {
  const nodeMap = new Map<string, ArticleNode>()

  for (const article of articles) {
    nodeMap.set(article.pathname, {
      pathname: article.pathname,
      title: article.title,
      icon: article.icon,
      children: [],
    })
  }

  const roots: ArticleNode[] = []

  for (const article of articles) {
    const node = nodeMap.get(article.pathname)!
    const trimmed = article.pathname.replace(/\/$/, "")
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
