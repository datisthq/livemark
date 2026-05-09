import { config } from "livemark:virtual"
import { allArticles } from "content-collections"
import type { ArticleNode } from "../models/article.ts"
import { buildArticleTree, flattenArticleTree } from "../helpers/article.ts"
import { matchSection, partitionBySection } from "../helpers/section.ts"

/**
 * Articles sorted by frontmatter `order`:
 * positive values first (ascending), then unordered, then negative values
 * (so `order: -1` lands at the very end, `-2` just before it, and so on).
 */
export const sortedArticles = [...allArticles].sort(
  (a, b) => orderKey(a.order) - orderKey(b.order),
)

/** The article whose path is `/`, if any (rendered in place at the root) */
export const homeArticle = sortedArticles.find(a => a.path === "/")

/** Sidebar tree derived from the article path hierarchy */
export const articleTree = buildArticleTree(sortedArticles)

/** Articles in depth-first order across the tree (matches sidebar walk) */
export const flatArticles = flattenArticleTree(articleTree)

/** The first article in sidebar order, used as the default landing page */
export const firstArticle = sortedArticles.find(a => a.path === flatArticles[0])

function orderKey(order?: number) {
  if (order === undefined) return Number.MAX_SAFE_INTEGER / 2
  if (order < 0) return Number.MAX_SAFE_INTEGER + order
  return order
}

const configSections = config.sections

/** Route-bound sections (everything except `custom`). Custom sections
 *  are pure links — they have no `prefix` and don't claim a URL space. */
const routedSections = configSections?.filter(s => s.type !== "custom") ?? []

/** Per-section article tree, keyed by section prefix */
export const sectionArticleTrees = new Map<string, ArticleNode[]>()

/** Per-section flat article lists, keyed by section prefix */
export const sectionFlatArticles = new Map<string, string[]>()

/** Per-section first article path, keyed by section prefix */
export const sectionFirstArticle = new Map<string, string | undefined>()

if (routedSections.length) {
  const sectionByPrefix = new Map(routedSections.map(s => [s.prefix, s]))
  const buckets = partitionBySection(sortedArticles, routedSections)
  for (const [key, bucket] of buckets) {
    const section = sectionByPrefix.get(key)
    const sorted =
      section?.type === "blog" || section?.type === "changelog"
        ? [...bucket].sort(
            (a, b) =>
              new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
          )
        : bucket
    const tree = buildArticleTree(sorted)
    const flat = flattenArticleTree(tree)
    sectionArticleTrees.set(key, tree)
    sectionFlatArticles.set(key, flat)
    sectionFirstArticle.set(key, flat[0])
  }
}

/** Find which routed config section an article path belongs to */
export function currentSection(path: string) {
  if (!routedSections.length) return undefined
  return matchSection(path, routedSections)
}
