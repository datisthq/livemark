import { sites } from "livemark:virtual"
import { articles, bodies } from "livemark:articles"
import type { ArticleNode } from "../models/article.ts"
import type { RoutedSection } from "../models/section.ts"
import type { Site } from "../models/site.ts"
import {
  buildArticleTree,
  compareArticleDate,
  compareArticleOrder,
  flattenArticleTree,
} from "../helpers/article.ts"
import { buildBreadcrumbs } from "../helpers/breadcrumbs.ts"
import { matchSection } from "../helpers/section.ts"
import { matchSite } from "../helpers/site.ts"

type Entry = (typeof articles)[number] & { untranslated?: boolean; source?: string }

const [defaultSite] = sites
const defaultSections = routedSections(defaultSite)

/**
 * Articles sorted by frontmatter `order`:
 * positive values first (ascending), then unordered, then negative values
 * (so `order: -1` lands at the very end, `-2` just before it, and so on).
 */
export const sortedArticles: Entry[] = [...articles, ...mirrorChangelogs()].sort(
  compareArticleOrder,
)

/** Every article's URL, changelog copies included */
export const articlePaths = new Set(sortedArticles.map(a => a.path))

/** Changelog copies: each names its original as canonical, so it is never an alternate */
export const mirrorPaths = new Set(sortedArticles.filter(a => a.source).map(a => a.path))

/** Per-language sorted articles plus the default-language ones it lacks, marked
 *  `untranslated` and keeping their default-language path. */
const languageEntries = new Map(
  sites.map(site => [site.language.code, collectEntries(site)] as const),
)

/** Per-language sidebar tree, for a site without routed sections */
export const languageArticleTrees = new Map(
  [...languageEntries].map(([code, entries]) => [code, buildArticleTree(entries)]),
)

/** Per-language articles in depth-first sidebar order */
export const languageFlatArticles = new Map(
  [...languageArticleTrees].map(([code, tree]) => [code, flattenArticleTree(tree)]),
)

/** Sidebar tree of the default language */
export const articleTree = languageArticleTrees.get(defaultSite.language.code) ?? []

/** Articles of the default language in depth-first order (matches sidebar walk) */
export const flatArticles = languageFlatArticles.get(defaultSite.language.code) ?? []

/** The article whose path is `/`, if any (rendered in place at the root) */
export const homeArticle = sortedArticles.find(a => a.path === "/")

/** The first article in sidebar order, used as the default landing page */
export const firstArticle = sortedArticles.find(a => a.path === flatArticles[0])

/** Per-section article tree, keyed by section prefix */
export const sectionArticleTrees = new Map<string, ArticleNode[]>()

/** Per-section flat article lists, keyed by section prefix */
export const sectionFlatArticles = new Map<string, string[]>()

/** Per-section first article path, keyed by section prefix */
export const sectionFirstArticle = new Map<string, string | undefined>()

for (const site of sites) {
  const sections = routedSections(site)
  if (!sections.length) continue
  const buckets = new Map<string, Entry[]>()
  for (const entry of languageEntries.get(site.language.code) ?? []) {
    // Sections match on the unprefixed key, so a translation and the default
    // article it stands in for land in the same section.
    const matched = matchSection(entry.key, defaultSections)
    const section = matched ? sections[defaultSections.indexOf(matched)] : undefined
    const key = section?.prefix ?? "__default__"
    buckets.set(key, [...(buckets.get(key) ?? []), entry])
  }
  for (const [key, bucket] of buckets) {
    const section = sections.find(s => s.prefix === key)
    const sorted =
      section?.type === "blog" || section?.type === "changelog"
        ? [...bucket].sort(compareArticleDate)
        : bucket
    const tree = buildArticleTree(sorted)
    const flat = flattenArticleTree(tree)
    sectionArticleTrees.set(key, tree)
    sectionFlatArticles.set(key, flat)
    sectionFirstArticle.set(key, flat[0])
  }
}

/** An article with its body (compiled MDX, raw Markdown, contents), which only its own
 *  page loads: on the client that fetches the article's own chunk. */
export async function loadArticle(path: string) {
  const article = sortedArticles.find(a => a.path === path)
  const load = bodies[article?.source ?? path]
  if (!article || !load) return undefined
  const body = await load()
  // A changelog entry shown in another language keeps its notes in the default one.
  const contentLanguage = article.source ? defaultSite.language.locale : undefined
  return { ...article, ...body.default, contentLanguage }
}

/** Find which routed config section an article path belongs to, in the
 *  language the path is in */
export function currentSection(path: string) {
  const sections = routedSections(matchSite(path, sites))
  if (!sections.length) return undefined
  return matchSection(path, sections)
}

/** The folders above an article in its language, each named by its section or by the
 *  article at its path — an untranslated one keeping its default-language path. */
export function listBreadcrumbs(path: string) {
  const site = matchSite(path, sites)
  const home = site.language.prefix
  const sections = routedSections(site)
  const entries = languageEntries.get(site.language.code) ?? []
  return buildBreadcrumbs(path, home, folder => {
    const section = sections.find(s => s.prefix === folder)
    if (section) return { title: section.title, path: sectionLanding(section) }
    const key = `/${folder.slice(home.length)}`
    const entry = entries.find(e => e.key === key)
    return entry && { title: entry.label ?? entry.title, path: entry.path }
  })
}

/** Where a section's link lands: a blog or changelog has an index at its prefix, a docs
 *  section only its first article */
export function sectionLanding(section: RoutedSection) {
  return section.type === "blog" || section.type === "changelog"
    ? section.prefix
    : (sectionFirstArticle.get(section.prefix) ?? section.prefix)
}

/** The site whose language a path is in */
export function currentSite(path: string) {
  return matchSite(path, sites)
}

/** The first article of a language in sidebar order, its landing page */
export function languageFirstArticle(site: Site) {
  const prefix = site.language.prefix
  return (
    sectionFirstArticle.get(prefix) ?? languageFlatArticles.get(site.language.code)?.[0]
  )
}

/** Every non-default language's copy of the changelog entries, under its own prefix:
 *  the page around the notes is translated, the notes stay as written. Each copy
 *  names the entry it shows as `source`, whose body it loads. */
function mirrorChangelogs(): Entry[] {
  return sites.flatMap(site => {
    if (site.language.default) return []
    const sections = routedSections(site)
    return defaultSections.flatMap((section, index) => {
      const mirror = sections[index]
      if (section.type !== "changelog" || !mirror) return []
      return articles
        .filter(a => a.language === defaultSite.language.code)
        .filter(a => a.path.startsWith(section.prefix))
        .map(a => ({
          ...a,
          path: mirror.prefix + a.path.slice(section.prefix.length),
          language: site.language.code,
          source: a.path,
        }))
    })
  })
}

function collectEntries(site: Site): Entry[] {
  const code = site.language.code
  const own = sortedArticles.filter(a => a.language === code)
  if (site.language.default) return own
  const translated = new Set(own.map(a => a.key))
  const missing = sortedArticles
    .filter(a => a.language === defaultSite.language.code && !translated.has(a.key))
    .map(a => ({ ...a, untranslated: true }))
  return [...own, ...missing].sort(compareArticleOrder)
}

/** A site's sections that own a URL prefix */
export function routedSections(site: Site) {
  return (site.config.sections ?? []).filter(
    (s): s is RoutedSection => s.type !== "custom",
  )
}
