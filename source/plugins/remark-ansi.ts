import type { Root } from "mdast"
import type { Plugin } from "unified"

interface AnsiState {
  bold: boolean
  dim: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  fg: string | undefined
  bg: string | undefined
}

const STANDARD_COLORS: ReadonlyArray<string> = [
  "#4f5b66", // 0 black
  "#bf616a", // 1 red
  "#a3be8c", // 2 green
  "#ebcb8b", // 3 yellow
  "#8fa1b3", // 4 blue
  "#b48ead", // 5 magenta
  "#96b5b4", // 6 cyan
  "#c0c5ce", // 7 white
]

const BRIGHT_COLORS: ReadonlyArray<string> = [
  "#65737e", // 8 bright black
  "#bf616a", // 9 bright red
  "#a3be8c", // 10 bright green
  "#ebcb8b", // 11 bright yellow
  "#8fa1b3", // 12 bright blue
  "#b48ead", // 13 bright magenta
  "#96b5b4", // 14 bright cyan
  "#eff1f5", // 15 bright white
]

function color256(n: number): string | undefined {
  if (n < 8) return STANDARD_COLORS[n]
  if (n < 16) return BRIGHT_COLORS[n - 8]
  if (n < 232) {
    const idx = n - 16
    const r = Math.floor(idx / 36)
    const g = Math.floor((idx % 36) / 6)
    const b = idx % 6
    const toHex = (v: number) =>
      (v === 0 ? 0 : 55 + v * 40).toString(16).padStart(2, "0")
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  if (n < 256) {
    const v = (8 + (n - 232) * 10).toString(16).padStart(2, "0")
    return `#${v}${v}${v}`
  }
  return undefined
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildStyle(state: AnsiState): string {
  const parts: string[] = []
  if (state.fg) parts.push(`color:${state.fg}`)
  if (state.bg) parts.push(`background-color:${state.bg}`)
  if (state.bold) parts.push("font-weight:bold")
  if (state.dim) parts.push("opacity:0.7")
  if (state.italic) parts.push("font-style:italic")
  if (state.underline) parts.push("text-decoration:underline")
  if (state.strikethrough) parts.push("text-decoration:line-through")
  return parts.join(";")
}

function makeDefaultState(): AnsiState {
  return {
    bold: false,
    dim: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fg: undefined,
    bg: undefined,
  }
}

function applyParams(state: AnsiState, params: ReadonlyArray<number>) {
  let i = 0
  while (i < params.length) {
    const code = params[i]!
    switch (code) {
      case 0: {
        const reset = makeDefaultState()
        state.bold = reset.bold
        state.dim = reset.dim
        state.italic = reset.italic
        state.underline = reset.underline
        state.strikethrough = reset.strikethrough
        state.fg = reset.fg
        state.bg = reset.bg
        break
      }
      case 1:
        state.bold = true
        break
      case 2:
        state.dim = true
        break
      case 3:
        state.italic = true
        break
      case 4:
        state.underline = true
        break
      case 9:
        state.strikethrough = true
        break
      case 22:
        state.bold = false
        state.dim = false
        break
      case 23:
        state.italic = false
        break
      case 24:
        state.underline = false
        break
      case 29:
        state.strikethrough = false
        break
      case 39:
        state.fg = undefined
        break
      case 49:
        state.bg = undefined
        break
      default:
        if (code >= 30 && code <= 37) {
          state.fg = STANDARD_COLORS[code - 30]
        } else if (code >= 40 && code <= 47) {
          state.bg = STANDARD_COLORS[code - 40]
        } else if (code >= 90 && code <= 97) {
          state.fg = BRIGHT_COLORS[code - 90]
        } else if (code >= 100 && code <= 107) {
          state.bg = BRIGHT_COLORS[code - 100]
        } else if (code === 38 || code === 48) {
          const kind = params[i + 1]
          if (kind === 5) {
            const colorIdx = params[i + 2]
            if (colorIdx !== undefined) {
              const c = color256(colorIdx)
              if (code === 38) state.fg = c
              else state.bg = c
            }
            i += 2
          } else if (kind === 2) {
            const r = params[i + 2] ?? 0
            const g = params[i + 3] ?? 0
            const b = params[i + 4] ?? 0
            const toHex = (v: number) => v.toString(16).padStart(2, "0")
            const c = `#${toHex(r)}${toHex(g)}${toHex(b)}`
            if (code === 38) state.fg = c
            else state.bg = c
            i += 4
          }
        }
        break
    }
    i++
  }
}

/** Convert a string containing ANSI escape sequences into HTML with inline styles */
export function ansiToHtml(input: string): string {
  // oxlint-disable-next-line no-control-regex -- ANSI escape sequences start with U+001B
  const sgr = /\u001b\[([0-9;]*)m/g
  const state = makeDefaultState()
  const parts: string[] = []
  let lastIndex = 0

  let match = sgr.exec(input)
  while (match !== null) {
    const textBefore = input.slice(lastIndex, match.index)
    if (textBefore) {
      const style = buildStyle(state)
      if (style) {
        parts.push(`<span style="${style}">${escapeHtml(textBefore)}</span>`)
      } else {
        parts.push(escapeHtml(textBefore))
      }
    }

    const rawParams = match[1]!
    const params =
      rawParams === ""
        ? [0]
        : rawParams.split(";").map(s => Number.parseInt(s, 10))
    applyParams(state, params)
    lastIndex = match.index + match[0].length
    match = sgr.exec(input)
  }

  const trailing = input.slice(lastIndex)
  if (trailing) {
    const style = buildStyle(state)
    if (style) {
      parts.push(`<span style="${style}">${escapeHtml(trailing)}</span>`)
    } else {
      parts.push(escapeHtml(trailing))
    }
  }

  return parts.join("")
}

/** Walk a mdast tree and convert ansi code blocks into AnsiCode JSX elements */
export function transformAnsiCodeBlocks(tree: Root) {
  const children = tree.children
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (node?.type !== "code" || node.lang !== "ansi") continue

    const html = ansiToHtml(node.value)

    const jsxNode = {
      type: "mdxJsxFlowElement" as const,
      name: "AnsiCode",
      attributes: [
        {
          type: "mdxJsxAttribute" as const,
          name: "html",
          value: html,
        },
      ],
      children: [],
    }

    // @ts-expect-error mdxJsxFlowElement is not in mdast types
    children[i] = jsxNode
  }
}

/** Remark plugin that converts ansi code blocks into colored HTML output */
export const remarkAnsi: Plugin<[], Root> = () => {
  return tree => {
    transformAnsiCodeBlocks(tree)
  }
}
