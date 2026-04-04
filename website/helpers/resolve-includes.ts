import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

const INCLUDE_RE = /^::include\{file="([^"]+)"\}$/gm
const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n?/

/** Resolves ::include{file="..."} directives by replacing them with referenced file contents */
export function resolveIncludes(
  content: string,
  filePath: string,
  depth = 0,
): string {
  if (depth > 5) return content

  const fileDir = dirname(filePath)

  return content.replace(INCLUDE_RE, (match, file: string) => {
    const absolutePath = resolve(fileDir, file)
    try {
      let included = readFileSync(absolutePath, "utf-8")
      included = included.replace(FRONTMATTER_RE, "")
      return resolveIncludes(included.trim(), absolutePath, depth + 1)
    } catch {
      return match
    }
  })
}
