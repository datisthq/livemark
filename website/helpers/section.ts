export interface SectionDef {
  icon?: string
  title: string
  prefix: string
  type?: "blog" | "changelog"
  source?: string
}

/** Find the section whose prefix is the longest prefix of the article path */
export function matchSection(
  articlePath: string,
  sections: SectionDef[],
): SectionDef | undefined {
  let best: SectionDef | undefined
  let bestLen = 0
  for (const section of sections) {
    if (
      articlePath.startsWith(section.prefix) &&
      section.prefix.length > bestLen
    ) {
      best = section
      bestLen = section.prefix.length
    }
  }
  return best
}

/** Split articles into per-section buckets. Unmatched articles go to "__default__" */
export function partitionBySection<T extends { path: string }>(
  articles: T[],
  sections: SectionDef[],
): Map<string, T[]> {
  const buckets = new Map<string, T[]>()
  for (const article of articles) {
    const section = matchSection(article.path, sections)
    const key = section?.prefix ?? "__default__"
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.push(article)
    } else {
      buckets.set(key, [article])
    }
  }
  return buckets
}
