/** Prefix a root-relative URL with `base` when the site is mounted at
 *  a sub-path. Leaves protocol-absolute (`http(s)://`, `//`), scheme
 *  (`mailto:`, `tel:`, `data:`), hash, and relative URLs untouched, and
 *  is idempotent — already-prefixed URLs are returned unchanged so
 *  config validation or hot reload can't double-prefix. */
export function prefixUrl(url: string, base: string | undefined) {
  if (!base) return url
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("data:") ||
    url.startsWith("#")
  ) {
    return url
  }
  if (!url.startsWith("/")) return url
  if (url === base || url.startsWith(`${base}/`)) return url
  return `${base}${url}`
}
