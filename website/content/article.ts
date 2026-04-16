import { allArticles } from "content-collections"
import type { ArticleGroup } from "../models/article.ts"
import {
  buildArticleTree,
  flattenArticleTree,
  groupArticleTree,
} from "../helpers/article.ts"
import { matchSection, partitionBySection } from "../helpers/section.ts"

/**
 * Articles sorted by frontmatter `order`:
 * positive values first (ascending), then unordered, then negative values
 * (so `order: -1` lands at the very end, `-2` just before it, and so on).
 */
export const sortedArticles = [...allArticles].sort(
  (a, b) => orderKey(a.order) - orderKey(b.order),
)

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

/** The first article in sidebar order, used as the default landing page */
export const firstArticle = sortedArticles.find(
  a => a.pathname === flatArticles[0],
)

function orderKey(order?: number) {
  if (order === undefined) return Number.MAX_SAFE_INTEGER / 2
  if (order < 0) return Number.MAX_SAFE_INTEGER + order
  return order
}

const configSections = import.meta.env.CONFIG.sections

/** Per-section article groups, keyed by section pathname */
export const sectionArticleGroups = new Map<string, ArticleGroup[]>()

/** Per-section flat article lists, keyed by section pathname */
export const sectionFlatArticles = new Map<string, string[]>()

/** Per-section first article pathname, keyed by section pathname */
export const sectionFirstArticle = new Map<string, string | undefined>()

if (configSections?.length) {
  const buckets = partitionBySection(sortedArticles, configSections)
  for (const [key, bucket] of buckets) {
    const tree = buildArticleTree(bucket)
    const groups = groupArticleTree(tree, bucket)
    const flat = groups.flatMap(g => flattenArticleTree(g.nodes))
    sectionArticleGroups.set(key, groups)
    sectionFlatArticles.set(key, flat)
    sectionFirstArticle.set(key, flat[0])
  }
}

/** Find which config section an article pathname belongs to */
export function currentSection(pathname: string) {
  if (!configSections?.length) return undefined
  return matchSection(pathname, configSections)
}
