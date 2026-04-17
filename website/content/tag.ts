import { sectionFlatArticles, sortedArticles } from "./article.ts"

const configSections = import.meta.env.CONFIG.sections

/** Per-section tag → article paths mapping. Articles sorted by date descending. */
export const sectionTags = new Map<string, Map<string, string[]>>()

if (configSections?.length) {
  for (const section of configSections) {
    if (section.type !== "blog") continue
    const flat = sectionFlatArticles.get(section.prefix) ?? []
    const tagMap = new Map<string, string[]>()
    for (const path of flat) {
      const article = sortedArticles.find(a => a.path === path)
      if (!article?.tags) continue
      for (const tag of article.tags) {
        const list = tagMap.get(tag)
        if (list) {
          list.push(path)
        } else {
          tagMap.set(tag, [path])
        }
      }
    }
    if (tagMap.size > 0) {
      sectionTags.set(section.prefix, tagMap)
    }
  }
}
