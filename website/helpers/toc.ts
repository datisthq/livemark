import GithubSlugger from "github-slugger"

export interface TocItem {
  url: string
  title: string
  depth: number
}

/** Extract TOC headings from raw markdown content */
export function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger()
  const items: TocItem[] = []
  const regex = /^(#{2,4})\s+(.+)$/gm

  let match = regex.exec(content)
  while (match) {
    const depth = match[1]!.length
    const title = match[2]!
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
    const slug = slugger.slug(title)
    items.push({ url: `#${slug}`, title, depth })
    match = regex.exec(content)
  }

  return items
}
