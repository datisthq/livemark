import type { TocItem } from "../models/toc.ts"

interface TocEntry {
  depth: number
  value: string
  id?: string
  children?: TocEntry[]
}

/** The h2 to h4 headings of html.extractToc's nested outline, in document order. */
export function flattenToc(toc: unknown) {
  const items: TocItem[] = []
  const stack: TocEntry[] = Array.isArray(toc) ? [...toc].reverse() : []
  while (stack.length > 0) {
    const entry = stack.pop()
    if (!entry) continue
    if (entry.depth >= 2 && entry.depth <= 4 && entry.id) {
      items.push({ url: `#${entry.id}`, title: entry.value, depth: entry.depth })
    }
    stack.push(...[...(entry.children ?? [])].reverse())
  }
  return items
}
