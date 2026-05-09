import type { Section } from "../models/section.ts"

const DEFAULT_ICONS: Record<Section["type"], string> = {
  article: "book-open",
  blog: "rss",
  changelog: "history",
  external: "external-link",
}

/** Return the section's icon, falling back to a type-based default */
export function sectionIcon(section: Pick<Section, "icon" | "type">) {
  return section.icon ?? DEFAULT_ICONS[section.type]
}

/** Find the section whose prefix is the longest prefix of the article path */
export function matchSection<S extends { prefix: string }>(
  articlePath: string,
  sections: S[],
): S | undefined {
  let best: S | undefined
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
  sections: { prefix: string }[],
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
