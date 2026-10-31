import { useEffect, type RefObject } from "react"

const HIGHLIGHT_NAME = "search-match"

/** Build a case-insensitive pattern matching each word of a search query */
export function buildHighlightPattern(query: string) {
  const words = [...new Set(query.toLowerCase().split(/\s+/))]
    .filter(word => word.length >= 2)
    .sort((a, b) => b.length - a.length)
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  if (!words.length) return undefined
  return new RegExp(words.join("|"), "gi")
}

/** Find the `[start, end]` offsets of every pattern match in a text */
export function findTextMatches(text: string, pattern: RegExp) {
  return [...text.matchAll(pattern)].map(
    match => [match.index, match.index + match[0].length] as const,
  )
}

/** Highlight search query matches under `root` and scroll to the first visible one;
 *  `page` re-runs it when the same query lands on another page */
export function useSearchHighlight(
  root: RefObject<HTMLElement | null>,
  page: string,
  query?: string,
) {
  useEffect(() => {
    const pattern = query ? buildHighlightPattern(query) : undefined
    if (!pattern || !root.current || typeof CSS === "undefined" || !CSS.highlights) return

    const ranges = collectMatchRanges(root.current, pattern)
    insertHighlightStyle()
    CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...ranges))

    // An explicit anchor in the URL wins over the first match. The frame delay lets
    // the router's scroll restoration, which resets to the top, run first.
    const frame = window.location.hash
      ? undefined
      : requestAnimationFrame(() => scrollToFirstVisible(ranges))

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame)
      CSS.highlights.delete(HIGHLIGHT_NAME)
    }
  }, [root, page, query])
}

// Not in styles/general.css: Lightning CSS, which optimizes it, does not know
// `::highlight()` and warns on every build. Still in `base`, so a project's CSS wins.
function insertHighlightStyle() {
  if (document.getElementById(HIGHLIGHT_STYLE_ID)) return
  const style = document.createElement("style")
  style.id = HIGHLIGHT_STYLE_ID
  style.textContent = `@layer base { ::highlight(${HIGHLIGHT_NAME}) { background-color: var(--highlight); color: var(--highlight-foreground); } }`
  document.head.append(style)
}

const HIGHLIGHT_STYLE_ID = "livemark-search-highlight"

function collectMatchRanges(root: HTMLElement, pattern: RegExp) {
  const ranges: Range[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node =>
      node.parentElement?.closest("pre, script, style, svg, textarea")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  })
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    for (const [start, end] of findTextMatches(node.textContent ?? "", pattern)) {
      const range = new Range()
      range.setStart(node, start)
      range.setEnd(node, end)
      ranges.push(range)
    }
  }
  return ranges
}

function scrollToFirstVisible(ranges: Range[]) {
  const first = ranges.find(range =>
    range.startContainer.parentElement?.checkVisibility(),
  )
  first?.startContainer.parentElement?.scrollIntoView({ block: "center" })
}
