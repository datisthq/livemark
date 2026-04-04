interface HastText {
  type: "text"
  value: string
}

interface HastElement {
  type: "element"
  properties: Record<string, unknown>
  children: (HastElement | HastText)[]
}

interface ShikiTransformer {
  name: string
  preprocess: (
    this: { options: { meta?: { __raw?: string } } },
    code: string,
  ) => void
  line: (line: HastElement, lineNumber: number) => HastElement | void
  span: (span: HastElement) => HastElement | void
}

function parseLineRanges(meta: string): Set<number> {
  const lines = new Set<number>()
  const match = meta.match(/\{([\d,\s-]+)\}/)
  if (!match) return lines

  const parts = match[1]!.split(",")
  for (const part of parts) {
    const trimmed = part.trim()
    const rangeMatch = trimmed.match(/^(\d+)-(\d+)$/)
    if (rangeMatch) {
      const start = Number(rangeMatch[1])
      const end = Number(rangeMatch[2])
      for (let i = start; i <= end; i++) {
        lines.add(i)
      }
    } else {
      const num = Number(trimmed)
      if (!Number.isNaN(num)) {
        lines.add(num)
      }
    }
  }

  return lines
}

function parseLineNumbers(meta: string): { enabled: boolean; start: number } {
  const match = meta.match(/\blineNumbers(?:=(\d+))?\b/)
  if (!match) return { enabled: false, start: 1 }
  const start = match[1] ? Number(match[1]) : 1
  return { enabled: true, start }
}

function parseWordHighlight(meta: string): string | undefined {
  const match = meta.match(/\{word:([^}]+)\}/)
  return match ? match[1] : undefined
}

function spanContainsWord(span: HastElement, word: string): boolean {
  for (const child of span.children) {
    if (child.type === "text" && child.value.includes(word)) {
      return true
    }
  }
  return false
}

/** Shiki transformer that highlights specific lines and words based on the code block meta string. */
export function transformerLineHighlight(): ShikiTransformer {
  let highlightedLines = new Set<number>()
  let lineNumbers = { enabled: false, start: 1 }
  let highlightedWord: string | undefined

  return {
    name: "livemark:line-highlight",
    preprocess() {
      const raw = this.options.meta?.__raw ?? ""
      highlightedLines = parseLineRanges(raw)
      lineNumbers = parseLineNumbers(raw)
      highlightedWord = parseWordHighlight(raw)
    },
    line(line, lineNumber) {
      if (highlightedLines.has(lineNumber)) {
        line.properties["data-highlighted"] = ""
      }
      if (lineNumbers.enabled) {
        line.properties["data-line-number"] = String(
          lineNumber - 1 + lineNumbers.start,
        )
      }
      return line
    },
    span(span) {
      if (highlightedWord && spanContainsWord(span, highlightedWord)) {
        span.properties["data-word-highlighted"] = ""
      }
      return span
    },
  }
}
