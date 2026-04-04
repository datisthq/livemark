interface HastElement {
  properties: Record<string, unknown>
}

interface ShikiTransformer {
  name: string
  pre: (pre: HastElement) => HastElement | void
  line: (line: HastElement, lineNumber: number) => HastElement | void
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

/** Shiki transformer that highlights specific lines based on the code block meta string. */
export function transformerLineHighlight(): ShikiTransformer {
  let highlightedLines = new Set<number>()

  return {
    name: "livemark:line-highlight",
    pre(pre) {
      const meta = String(pre.properties["data-meta"] ?? "")
      highlightedLines = parseLineRanges(meta)
      return pre
    },
    line(line, lineNumber) {
      if (highlightedLines.has(lineNumber)) {
        line.properties["data-highlighted"] = ""
      }
      return line
    },
  }
}
