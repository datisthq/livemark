import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"

/** What in an article's Markdown renders silently wrong, by file line: a directive
 *  written with a space or under an unknown name, which shows as plain text, and a
 *  relative image whose file is missing. Fenced code is skipped. */
export function findContentWarnings(props: {
  text: string
  filePath: string
  directives: Set<string>
}) {
  const warnings: string[] = []
  let fence: string | undefined
  props.text.split(/\r?\n/).forEach((line, index) => {
    const marker = FENCE.exec(line)?.[1]
    if (marker && (!fence || marker.startsWith(fence))) {
      fence = fence ? undefined : marker
      return
    }
    if (fence) return
    const warn = (message: string) => warnings.push(`line ${index + 1}: ${message}`)

    const spaced = SPACED_DIRECTIVE.exec(line)
    if (spaced) {
      const [, colons, name] = spaced
      warn(
        `"${colons} ${name}" has a space after the colons, so it renders as text; write "${colons}${name}"`,
      )
    }
    const directive = DIRECTIVE.exec(line)
    if (directive?.[2] && !props.directives.has(directive[2])) {
      warn(`unknown directive "${directive[1]}${directive[2]}" renders as text`)
    }
    for (const match of line.matchAll(IMAGE)) {
      const src = match[1] ?? match[2]
      if (src && isRelative(src) && !existsSync(resolveImage(src, props.filePath))) {
        warn(`image "${src}" not found`)
      }
    }
  })
  return warnings
}

const FENCE = /^\s{0,3}(`{3,}|~{3,})/
const SPACED_DIRECTIVE = /^\s*(:{2,})\s+([A-Za-z][\w-]*)/
const DIRECTIVE = /^\s*(:{2,})([A-Za-z][\w-]*)/
const IMAGE = /!\[[^\]]*\]\(\s*<?([^)\s>]+)|<img\b[^>]*\bsrc=["']([^"']+)["']/g

function isRelative(src: string) {
  return !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(src)
}

function resolveImage(src: string, filePath: string) {
  const path = src.split(/[?#]/)[0] ?? src
  return resolve(dirname(filePath), decodeURI(path))
}
