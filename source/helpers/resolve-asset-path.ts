import { dirname, relative, resolve, sep } from "node:path"
import { prefixUrl } from "./prefix-url.ts"

/** Resolve a relative asset path to an absolute URL serveable by Vite */
export function resolveAssetPath(
  url: string,
  filePath: string,
  root: string,
  base?: string,
) {
  if (url.startsWith("http") || url.startsWith("data:")) return url
  if (url.startsWith("/")) return prefixUrl(url, base)
  const absolute = resolve(dirname(filePath), url)
  const rel = relative(root, absolute).split(sep).join("/")
  return prefixUrl("/" + rel, base)
}
