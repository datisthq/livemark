import { sites } from "livemark:virtual"
import type { Site } from "../models/site.ts"
import { localizePath, unlocalizePath } from "../helpers/site.ts"
import { articlePaths, currentSite, mirrorPaths, routedSections } from "./article.ts"
import { sectionTags } from "./tag.ts"

/** Blog tag pages, `/<blog prefix>tags/<tag>/` */
const tagPaths = new Set(
  [...sectionTags].flatMap(([prefix, tags]) =>
    [...tags.keys()].map(tag => `${prefix}tags/${tag}/`),
  ),
)

/** The same page in another language: its translation, a section index there, or
 *  that language's home when the page has neither. */
export function translatePath(path: string, target: Site) {
  const key = unlocalizePath(path, currentSite(path).language)
  const candidate = localizePath(key, target.language)
  if (pageExists(candidate, target)) return candidate
  return target.language.prefix
}

/** Every language's version of a page that exists, the current one included */
export function listTranslations(path: string) {
  const key = unlocalizePath(path, currentSite(path).language)
  return sites.flatMap(site => {
    const candidate = localizePath(key, site.language)
    if (mirrorPaths.has(candidate)) return []
    const exists = candidate === site.language.prefix || pageExists(candidate, site)
    return exists ? [{ language: site.language, path: candidate }] : []
  })
}

function pageExists(path: string, site: Site) {
  return (
    articlePaths.has(path) ||
    tagPaths.has(path) ||
    routedSections(site).some(s => s.prefix === path)
  )
}
