import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import { prefixUrl } from "./prefix-url.ts"

interface HastNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

export function renderInlineMarkdown(markdown: string, base: string | undefined) {
  const html = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => (tree: HastNode) => rewriteLinks(tree, base))
    .use(() => unwrapParagraphs)
    .use(rehypeStringify)
    .processSync(markdown)
  return String(html).trim()
}

function rewriteLinks(tree: HastNode, base: string | undefined) {
  visit(tree, "element", (node: HastNode) => {
    if (node.tagName !== "a" || typeof node.properties?.href !== "string") return
    const href = node.properties.href
    node.properties.href = prefixUrl(href, base)
    if (/^https?:\/\//.test(href)) {
      node.properties.target = "_blank"
      node.properties.rel = ["noopener", "noreferrer"]
    }
  })
}

function unwrapParagraphs(tree: HastNode) {
  tree.children = (tree.children ?? []).flatMap(child =>
    child.type === "element" && child.tagName === "p" ? (child.children ?? []) : [child],
  )
}
