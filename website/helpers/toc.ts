import GithubSlugger from "github-slugger"

export interface TocItem {
  url: string
  title: string
  depth: number
}

const CUSTOM_ID_PATTERN = /\s*\[#([^\]]+)\]\s*$/
const TOC_HIDDEN_PATTERN = /\s*\[!toc\]\s*$/
const TOC_ONLY_PATTERN = /\s*\[toc\]\s*$/
const STEP_PATTERN = /\s*\[step\]\s*$/

/** Extract TOC headings from raw markdown content */
export function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger()
  const items: TocItem[] = []
  const headingRegex = /^(#{2,4})\s+(.+)$/
  const lines = content.split("\n")
  let inCodeBlock = false

  for (const line of lines) {
    if (line.startsWith("```") || line.startsWith("````")) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = headingRegex.exec(line)
    if (!match) continue

    const depth = match[1]!.length
    const rawTitle = match[2]!

    if (TOC_HIDDEN_PATTERN.test(rawTitle)) continue
    if (STEP_PATTERN.test(rawTitle)) continue

    const idMatch = CUSTOM_ID_PATTERN.exec(rawTitle)
    const title = rawTitle
      .replace(CUSTOM_ID_PATTERN, "")
      .replace(TOC_ONLY_PATTERN, "")
      .replace(STEP_PATTERN, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
    const slug = idMatch?.[1] ?? slugger.slug(title)

    items.push({ url: `#${slug}`, title, depth })
  }

  return items
}
