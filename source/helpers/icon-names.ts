/** The key of a Lucide icon in its `icons` map: `file-pen-line` → `FilePenLine`. */
export function toIconKey(name: string) {
  return name
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}

/** The icons a site can render: every name given outright, plus every quoted string in
 *  `texts` (compiled articles, escaped components) that names a known icon. */
export function collectIconKeys(props: {
  names: string[]
  texts: string[]
  known: ReadonlySet<string>
}) {
  const keys = new Set<string>()
  const add = (name: string) => {
    const key = toIconKey(name)
    if (props.known.has(key)) keys.add(key)
  }
  props.names.forEach(add)
  for (const text of props.texts) {
    for (const match of text.matchAll(/["'`]([A-Za-z][\w-]*)["'`]/g)) {
      if (match[1]) add(match[1])
    }
  }
  return [...keys].sort()
}

/** The module `DynamicIcon` resolves names from: only the icons the site uses. */
export function renderIconsModule(keys: string[]) {
  if (keys.length === 0) return "export const icons = {}"
  return [
    `import { ${keys.join(", ")} } from "lucide-react"`,
    `export const icons = { ${keys.join(", ")} }`,
  ].join("\n")
}
