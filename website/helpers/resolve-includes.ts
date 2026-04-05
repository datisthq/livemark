import { readFileSync } from "node:fs"
import { dirname, extname, resolve } from "node:path"

const INCLUDE_RE = /^::include\{(.+)\}$/gm
const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n?/

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

/** Resolves ::include{file="..."} directives by replacing them with referenced file contents */
export function resolveIncludes(
  content: string,
  filePath: string,
  depth = 0,
): string {
  if (depth > 5) return content

  const fileDir = dirname(filePath)

  return content.replace(INCLUDE_RE, (fullMatch, rawAttrs: string) => {
    const attrs = parseAttributes(rawAttrs)
    const file = attrs.file
    if (!file) return fullMatch

    const absolutePath = resolve(fileDir, file)
    try {
      let included = readFileSync(absolutePath, "utf-8")

      const ext = extname(file).toLowerCase()
      const lang = extToLang[ext]

      if (lang && !file.endsWith(".md")) {
        const meta = attrs.meta ? ` ${attrs.meta}` : ""
        return "```" + lang + meta + "\n" + included.trimEnd() + "\n```"
      }

      included = included.replace(FRONTMATTER_RE, "")
      return resolveIncludes(included.trim(), absolutePath, depth + 1)
    } catch {
      return fullMatch
    }
  })
}
