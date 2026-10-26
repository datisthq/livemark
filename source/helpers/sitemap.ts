/** Drop the `<url>` entries whose page names a different canonical URL: a sitemap
 *  lists only canonical pages. `canonicalOf` returns undefined for a page it cannot
 *  read, which keeps the entry. */
export function removeNonCanonicalUrls(
  xml: string,
  canonicalOf: (loc: string) => string | undefined,
) {
  return xml.replace(/[ \t]*<url>[\s\S]*?<\/url>\n?/g, entry => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(entry)?.[1]
    if (!loc) return entry
    const canonical = canonicalOf(loc)
    return canonical === undefined || canonical === loc ? entry : ""
  })
}

/** The canonical URL a prerendered page declares, if any. */
export function readCanonical(html: string) {
  return /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]
}
