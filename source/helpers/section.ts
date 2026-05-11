import type { Section } from "../models/section.ts"

/** Return the section whose prefix or internal-URL best matches the
 *  given pathname. Routed sections (article/blog/changelog) match by
 *  `prefix`. Custom sections with internal URLs (`/`-leading, not
 *  `//`) match by their URL — with the same exact-`/` guard as
 *  `customSectionActive` so a custom URL of `/` only activates on
 *  the home page itself. Custom sections with absolute URLs never
 *  match. Longest match wins. */
export function activeSiteSection(pathname: string, sections: Section[]) {
  const current = `/${pathname.replace(/^\/|\/$/g, "")}/`
  let best: Section | undefined
  let bestLen = 0
  for (const s of sections) {
    const prefix = sectionMatchPrefix(s)
    if (!prefix) continue
    if (s.type === "custom" && prefix === "/" && current !== "/") continue
    if (!current.startsWith(prefix)) continue
    if (prefix.length > bestLen) {
      best = s
      bestLen = prefix.length
    }
  }
  return best
}

function sectionMatchPrefix(s: Section): string | undefined {
  if (s.type !== "custom") return s.prefix
  if (!s.url.startsWith("/") || s.url.startsWith("//")) return undefined
  const stripped = s.url.split(/[?#]/)[0] ?? ""
  return `/${stripped.replace(/^\/|\/$/g, "")}/`
}

/** Whether a custom section's URL should highlight as active for the
 *  current pathname. Only `/`-leading internal paths participate;
 *  protocol-absolute (`https://…`, `//cdn…`) URLs never highlight.
 *  Match semantics mirror routed sections — exact path or any
 *  descendant. A URL of `/` only highlights the home page itself
 *  (otherwise it would always match). */
export function customSectionActive(url: string, pathname: string) {
  if (!url.startsWith("/") || url.startsWith("//")) return false
  const stripped = url.split(/[?#]/)[0] ?? ""
  const target = `/${stripped.replace(/^\/|\/$/g, "")}/`
  const current = `/${pathname.replace(/^\/|\/$/g, "")}/`
  if (target === "/") return current === "/"
  return current === target || current.startsWith(target)
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
