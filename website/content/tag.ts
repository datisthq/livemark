import { sectionFlatArticles, sortedArticles } from "./article.ts"

const configSections = import.meta.env.CONFIG.sections

/** Per-section tag → article pathnames mapping. Articles sorted by date descending. */
export const sectionTags = new Map<string, Map<string, string[]>>()

if (configSections?.length) {
  for (const section of configSections) {
    if (section.type !== "blog") continue
    const flat = sectionFlatArticles.get(section.pathname) ?? []
    const tagMap = new Map<string, string[]>()
    for (const pathname of flat) {
      const article = sortedArticles.find(a => a.pathname === pathname)
      if (!article?.tags) continue
      for (const tag of article.tags) {
        const list = tagMap.get(tag)
        if (list) {
          list.push(pathname)
        } else {
          tagMap.set(tag, [pathname])
        }
      }
    }
    if (tagMap.size > 0) {
      sectionTags.set(section.pathname, tagMap)
    }
  }
}
