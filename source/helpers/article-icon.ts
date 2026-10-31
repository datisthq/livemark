import { icons } from "livemark:icons"
import { toIconKey } from "./icon-names.ts"

/** Resolve a Lucide icon by kebab-case name. Returns undefined when no
 *  name is given or the name doesn't match an icon the site uses — articles
 *  without an explicit `icon` frontmatter render with no icon at all. */
export function resolveArticleIcon(name: string | undefined) {
  if (!name) return undefined
  return icons[toIconKey(name)]
}
