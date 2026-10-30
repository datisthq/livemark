import type { Config } from "../../models/config.ts"
import type { TocItem } from "../../models/toc.ts"
import { createProcessor } from "../processor/create.ts"

/** Compile an article body with textlane into an MDX function body and its table of
 *  contents, as plain Markdown or as MDX: `format` wins, else a `.mdx` file is MDX. */
export async function compileArticle(props: {
  content: string
  filePath: string
  format?: "md" | "mdx"
  config: Config
}) {
  const format = props.format ?? (props.filePath.endsWith(".mdx") ? "mdx" : "md")
  const twoslash = TWOSLASH_FENCE.test(props.content)
  const processor = readProcessor(props.config, format, twoslash)
  const file = await processor.process({ value: props.content, path: props.filePath })
  return { mdx: file.value, tocItems: flattenToc(file.data.toc) }
}

/** A fenced code block whose meta names `twoslash` */
export const TWOSLASH_FENCE = /^[ \t>]*(?:`{3,}|~{3,})[^\n]*\btwoslash\b/m

// A frozen processor runs any number of articles, so each variant is built once a build
const processors = new Map<string, ReturnType<typeof createProcessor>>()

function readProcessor(config: Config, format: "md" | "mdx", twoslash: boolean) {
  const key = `${format}:${twoslash}`
  let processor = processors.get(key)
  if (!processor) {
    processor = createProcessor({ config, format, twoslash })
    processors.set(key, processor)
  }
  return processor
}

interface TocEntry {
  depth: number
  value: string
  id?: string
  children?: TocEntry[]
}

// html.extractToc nests headings; the article's outline lists h2 to h4 in order
function flattenToc(toc: unknown): TocItem[] {
  const items: TocItem[] = []
  const stack: TocEntry[] = Array.isArray(toc) ? [...toc].reverse() : []
  while (stack.length > 0) {
    const entry = stack.pop()
    if (!entry) continue
    if (entry.depth >= 2 && entry.depth <= 4 && entry.id) {
      items.push({ url: `#${entry.id}`, title: entry.value, depth: entry.depth })
    }
    stack.push(...[...(entry.children ?? [])].reverse())
  }
  return items
}
