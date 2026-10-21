import GithubSlugger, { slug as slugOnce } from "github-slugger"
import type { Root } from "mdast"
import { toString } from "mdast-util-to-string"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import type { TocItem } from "../models/toc.ts"

const CUSTOM_ID_PATTERN = /\s*\[#([^\]]+)\]\s*$/
const TOC_HIDDEN_PATTERN = /\s*\[!toc\]\s*$/
const TOC_ONLY_PATTERN = /\s*\[toc\]\s*$/
const STEP_PATTERN = /\s*\[step\]\s*$/

/** Extract TOC headings from markdown content, with ids matching the rendered headings */
export function extractToc(content: string): TocItem[] {
  const tree: Root = unified().use(remarkParse).use(remarkGfm).parse(content)
  const slugger = new GithubSlugger()
  const items: TocItem[] = []

  // rehype-slug numbers duplicates across every rendered heading, so hidden, step and
  // out-of-range headings advance the slugger; `[toc]` ones are never rendered, so do not
  visit(tree, "heading", node => {
    const lastChild = node.children.at(-1)
    const marker = lastChild?.type === "text" ? lastChild.value : ""
    const isTocOnly = TOC_ONLY_PATTERN.test(marker)
    const isHidden = TOC_HIDDEN_PATTERN.test(marker) || STEP_PATTERN.test(marker)
    const customId = CUSTOM_ID_PATTERN.exec(marker)?.[1]

    if (lastChild?.type === "text") {
      lastChild.value = marker
        .replace(CUSTOM_ID_PATTERN, "")
        .replace(TOC_ONLY_PATTERN, "")
        .replace(TOC_HIDDEN_PATTERN, "")
        .replace(STEP_PATTERN, "")
    }

    const title = toString(node).trim()
    const slug = customId ?? (isTocOnly ? slugOnce(title) : slugger.slug(title))

    if (isHidden || node.depth < 2 || node.depth > 4) return
    items.push({ url: `#${slug}`, title, depth: node.depth })
  })

  return items
}
