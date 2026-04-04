import type { Heading, Root } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

declare module "mdast" {
  interface HeadingData {
    hProperties?: Record<string, unknown>
  }
}

const CUSTOM_ID_PATTERN = /\s*\[#([^\]]+)\]\s*$/

/** Walk a mdast tree and move `[#id]` suffixes from heading text into `hProperties.id` */
export function transformCustomHeadingIds(tree: Root) {
  visit(tree, "heading", (node: Heading) => {
    const lastChild = node.children[node.children.length - 1]
    if (!lastChild || lastChild.type !== "text") return

    const match = CUSTOM_ID_PATTERN.exec(lastChild.value)
    if (!match) return

    const customId = match[1]
    if (!customId) return

    lastChild.value = lastChild.value.replace(CUSTOM_ID_PATTERN, "")

    if (lastChild.value === "" && node.children.length > 1) {
      node.children.pop()
    }

    node.data = node.data ?? {}
    node.data.hProperties = { ...node.data.hProperties, id: customId }
  })
}

/** Remark plugin that extracts `[#custom-id]` from heading text and sets it as the heading's HTML id */
const remarkCustomHeadingId: Plugin<[], Root> = () => {
  return tree => {
    transformCustomHeadingIds(tree)
  }
}

export default remarkCustomHeadingId
