import { readFileSync } from "node:fs"
import { dirname, extname, resolve } from "node:path"

const INCLUDE_RE = /^::include\{(.+)\}$/
const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n?/
const FENCE_RE = /^(`{3,}|~{3,})/

const extToLang: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "tsx",
  ".js": "javascript",
  ".jsx": "jsx",
  ".py": "python",
  ".rs": "rust",
  ".go": "go",
  ".rb": "ruby",
  ".java": "java",
  ".kt": "kotlin",
  ".swift": "swift",
  ".c": "c",
  ".cpp": "cpp",
  ".h": "c",
  ".cs": "csharp",
  ".css": "css",
  ".scss": "scss",
  ".html": "html",
  ".json": "json",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
  ".xml": "xml",
  ".sql": "sql",
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "zsh",
  ".fish": "fish",
  ".ps1": "powershell",
  ".dockerfile": "dockerfile",
  ".graphql": "graphql",
  ".proto": "protobuf",
  ".lua": "lua",
  ".php": "php",
  ".r": "r",
  ".zig": "zig",
  ".ex": "elixir",
  ".exs": "elixir",
}

function parseAttributes(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /(\w+)="([^"]+)"/g
  let m: RegExpExecArray | null = null
  while ((m = re.exec(raw)) !== null) {
    attrs[m[1]!] = m[2]!
  }
  return attrs
}

function resolveDirective(
  rawAttrs: string,
  fileDir: string,
  depth: number,
): string | undefined {
  const attrs = parseAttributes(rawAttrs)
  const file = attrs.file
  if (!file) return undefined

  const absolutePath = resolve(fileDir, file)
  try {
    let included = readFileSync(absolutePath, "utf-8")

    const ext = extname(file).toLowerCase()
    const lang = extToLang[ext]

    if (lang && !file.endsWith(".md")) {
      const filename = file.split("/").pop()!
      const title = `title="${filename}"`
      const meta = attrs.meta ? ` ${attrs.meta}` : ""
      return (
        "```" + lang + " " + title + meta + "\n" + included.trimEnd() + "\n```"
      )
    }

    included = included.replace(FRONTMATTER_RE, "")
    return resolveIncludes(included.trim(), absolutePath, depth + 1)
  } catch {
    return undefined
  }
}

/** Resolves ::include{file="..."} directives by replacing them with referenced file contents */
export function resolveIncludes(
  content: string,
  filePath: string,
  depth = 0,
): string {
  if (depth > 5) return content

  const fileDir = dirname(filePath)
  const lines = content.split("\n")
  const result: string[] = []
  let fenceMarker: string | undefined

  for (const line of lines) {
    const fenceMatch = FENCE_RE.exec(line)
    if (fenceMatch) {
      if (!fenceMarker) {
        fenceMarker = fenceMatch[1]!
      } else if (line.startsWith(fenceMarker)) {
        fenceMarker = undefined
      }
      result.push(line)
      continue
    }

    if (fenceMarker) {
      result.push(line)
      continue
    }

    const includeMatch = INCLUDE_RE.exec(line)
    if (includeMatch) {
      const resolved = resolveDirective(includeMatch[1]!, fileDir, depth)
      result.push(resolved ?? line)
    } else {
      result.push(line)
    }
  }

  return result.join("\n")
}
