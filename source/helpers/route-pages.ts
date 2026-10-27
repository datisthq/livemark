import { existsSync, readdirSync } from "node:fs"

/** The URL of every static file route under `routesDir`, slash-terminated unless it
 *  names a file. Prerender only crawls links, so a custom page nothing links to needs
 *  seeding from here. */
export function listRoutePages(routesDir: string) {
  if (!existsSync(routesDir)) return []
  const files = readdirSync(routesDir, { recursive: true, encoding: "utf-8" })
  const pages = files.flatMap(file => {
    const path = readRoutePath(file.replaceAll("\\", "/"))
    return path === undefined ? [] : [path]
  })
  return [...new Set(pages)].sort()
}

function readRoutePath(file: string) {
  if (!/\.tsx?$/.test(file)) return undefined
  const parts = file.replace(/\.tsx?$/, "").split("/")
  if (parts.some(part => part.startsWith("-") || part.startsWith("__"))) return undefined
  // Flat routes nest on unescaped dots: `blog.index` is `blog/index`.
  const segments = parts.flatMap(part => part.split(/(?<!\[)\.(?!\])/))
  if (segments.some(segment => segment.includes("$"))) return undefined
  const kept = segments
    .filter(segment => !["index", "route"].includes(segment))
    .filter(segment => !/^\(.*\)$/.test(segment) && !segment.startsWith("_"))
    .map(segment => segment.replaceAll(/\[(.)\]/g, "$1"))
  if (!kept.length) return "/"
  const path = `/${kept.join("/")}`
  return kept.at(-1)?.includes(".") ? path : `${path}/`
}
