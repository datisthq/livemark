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
  preprocess?: (
    this: { options: { meta?: { __raw?: string } } },
    code: string,
  ) => void
  pre?: (pre: HastElement) => HastElement | void
  line?: (line: HastElement, lineNumber: number) => HastElement | void
  span?: (span: HastElement) => HastElement | void
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

const NOTATION_RE =
  /\/\/\s*\[!code\s+(highlight|focus|\+\+|--|error|warning)\]\s*$/
const NOTATION_BLOCK_RE =
  /\/\*\s*\[!code\s+(highlight|focus|\+\+|--|error|warning)\]\s*\*\/\s*$/

function stripNotationFromLine(line: HastElement): string | undefined {
  for (const child of line.children) {
    if (child.type === "element") {
      const result = stripNotationFromLine(child)
      if (result !== undefined) return result
    }
    if (child.type === "text") {
      const match =
        child.value.match(NOTATION_RE) ?? child.value.match(NOTATION_BLOCK_RE)
      if (match) {
        child.value = child.value.slice(0, match.index).trimEnd()
        return match[1]!
      }
    }
  }
  return undefined
}

/** Shiki transformer that handles comment-based code annotations for highlighting, diffs, and focus effects. */
export function transformerNotations(): ShikiTransformer {
  let hasFocus = false
  let preElement: HastElement | undefined

  return {
    name: "livemark:notations",
    preprocess() {
      hasFocus = false
      preElement = undefined
    },
    line(line) {
      const notation = stripNotationFromLine(line)
      if (!notation) return line

      switch (notation) {
        case "highlight":
          line.properties["data-highlighted"] = ""
          break
        case "++":
          line.properties["data-diff"] = "add"
          break
        case "--":
          line.properties["data-diff"] = "remove"
          break
        case "focus":
          line.properties["data-focus"] = ""
          hasFocus = true
          break
        case "error":
          line.properties["data-line-status"] = "error"
          break
        case "warning":
          line.properties["data-line-status"] = "warning"
          break
      }

      return line
    },
    pre(pre) {
      preElement = pre
      if (hasFocus && preElement) {
        preElement.properties["data-has-focus"] = ""
      }
      return pre
    },
  }
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
