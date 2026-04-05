import type { Root } from "mdast"
import type { LeafDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Walk a mdast tree and convert toc leaf directives into InlineToc JSX elements */
export function transformTocDirectives(tree: Root) {
  visit(tree, "leafDirective", (node: LeafDirective, index, parent) => {
    if (node.name !== "toc" || index === undefined || !parent) return

    const maxLevel = node.attributes?.maxLevel

    const jsxNode = {
      type: "mdxJsxFlowElement" as const,
      name: "InlineToc",
      attributes: maxLevel
        ? [
            {
              type: "mdxJsxAttribute" as const,
              name: "maxLevel",
              value: maxLevel,
            },
          ]
        : [],
      children: [],
      data: { _mdxExplicitJsx: true },
    }

    // @ts-expect-error mdxJsxFlowElement is not in mdast types
    parent.children.splice(index, 1, jsxNode)
  })
}

/** Remark plugin that converts ::toc leaf directives into InlineToc JSX elements */
export const remarkToc: Plugin<[], Root> = () => {
  return tree => {
    transformTocDirectives(tree)
  }
}
