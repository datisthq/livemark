/** Derive the MIME type for a favicon from its file extension */
export function faviconType(href: string) {
  if (href.endsWith(".svg")) return "image/svg+xml"
  if (href.endsWith(".png")) return "image/png"
  if (href.endsWith(".ico")) return "image/x-icon"
  return undefined
}
