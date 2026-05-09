import { icons } from "lucide-react"

/** Resolve a Lucide icon by kebab-case name. Returns undefined when no
 *  name is given or the name doesn't match a known icon — articles
 *  without an explicit `icon` frontmatter render with no icon at all. */
export function resolveArticleIcon(name: string | undefined) {
  if (!name) return undefined
  const key = toPascalCase(name)
  return key in icons ? icons[key as keyof typeof icons] : undefined
}

function toPascalCase(name: string) {
  return name
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}
