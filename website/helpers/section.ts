export interface SectionDef {
  icon?: string
  title: string
  pathname: string
  type?: "blog"
}

/** Find the section whose pathname is the longest prefix of the article pathname */
export function matchSection(
  articlePathname: string,
  sections: SectionDef[],
): SectionDef | undefined {
  let best: SectionDef | undefined
  let bestLen = 0
  for (const section of sections) {
    if (
      articlePathname.startsWith(section.pathname) &&
      section.pathname.length > bestLen
    ) {
      best = section
      bestLen = section.pathname.length
    }
  }
  return best
}

/** Split articles into per-section buckets. Unmatched articles go to "__default__" */
export function partitionBySection<T extends { pathname: string }>(
  articles: T[],
  sections: SectionDef[],
): Map<string, T[]> {
  const buckets = new Map<string, T[]>()
  for (const article of articles) {
    const section = matchSection(article.pathname, sections)
    const key = section?.pathname ?? "__default__"
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.push(article)
    } else {
      buckets.set(key, [article])
    }
  }
  return buckets
}
