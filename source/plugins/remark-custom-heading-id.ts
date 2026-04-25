import type { Heading, Root } from "mdast"
import type { Plugin } from "unified"
import { SKIP, visit } from "unist-util-visit"

declare module "mdast" {
  interface HeadingData {
    hProperties?: Record<string, string | number | boolean | null | undefined>
  }
}

const CUSTOM_ID_PATTERN = /\s*\[#([^\]]+)\]\s*$/
const TOC_HIDDEN_PATTERN = /\s*\[!toc\]\s*$/
const TOC_ONLY_PATTERN = /\s*\[toc\]\s*$/

/** Walk a mdast tree and process heading annotations: `[#id]`, `[!toc]`, and `[toc]` */
export function transformHeadingAnnotations(tree: Root) {
  visit(tree, "heading", (node: Heading, index, parent) => {
    const lastChild = node.children[node.children.length - 1]
    if (!lastChild || lastChild.type !== "text") return undefined

    if (TOC_ONLY_PATTERN.test(lastChild.value)) {
      if (parent && index !== undefined) {
        parent.children.splice(index, 1)
        return [SKIP, index] as const
      }
      return undefined
    }

    if (TOC_HIDDEN_PATTERN.test(lastChild.value)) {
      lastChild.value = lastChild.value.replace(TOC_HIDDEN_PATTERN, "")
      if (lastChild.value === "" && node.children.length > 1) {
        node.children.pop()
      }
      node.data = node.data ?? {}
      node.data.hProperties = {
        ...node.data.hProperties,
        "data-toc-hidden": true,
      }
      return undefined
    }

    const match = CUSTOM_ID_PATTERN.exec(lastChild.value)
    if (!match) return undefined

    const customId = match[1]
    if (!customId) return undefined

    lastChild.value = lastChild.value.replace(CUSTOM_ID_PATTERN, "")

    if (lastChild.value === "" && node.children.length > 1) {
      node.children.pop()
    }

    node.data = node.data ?? {}
    node.data.hProperties = { ...node.data.hProperties, id: customId }
    return undefined
  })
}

/** @deprecated Use transformHeadingAnnotations instead */
export const transformCustomHeadingIds = transformHeadingAnnotations

/** Remark plugin that processes heading annotations: `[#custom-id]`, `[!toc]`, and `[toc]` */
const remarkCustomHeadingId: Plugin<[], Root> = () => {
  return tree => {
    transformHeadingAnnotations(tree)
  }
}

export default remarkCustomHeadingId
