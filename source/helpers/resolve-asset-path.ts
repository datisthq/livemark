import { dirname, relative, resolve } from "node:path"

/** Resolve a relative asset path to an absolute URL serveable by Vite */
export function resolveAssetPath(url: string, filePath: string, root: string) {
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:"))
    return url
  const absolute = resolve(dirname(filePath), url)
  return "/" + relative(root, absolute)
}
