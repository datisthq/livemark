import { dirname, relative, resolve } from "node:path"
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
  return prefixUrl("/" + relative(root, absolute), base)
}
