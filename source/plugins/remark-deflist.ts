import type { Root, Parent } from "mdast"
import type { Plugin } from "unified"
import { visit, SKIP } from "unist-util-visit"

/** Remark plugin that converts defList nodes into DefinitionList/DefinitionTerm/DefinitionDetail JSX elements */
export const remarkDeflist: Plugin<[], Root> = () => {
  return tree => {
    visit(tree, "defList", (node: Parent, index, parent) => {
      if (index === undefined || !parent) return

      const children = node.children.map(child => {
        const name =
          child.type === "defListTerm" ? "DefinitionTerm" : "DefinitionDetail"
        return {
          type: "mdxJsxFlowElement" as const,
          name,
          attributes: [],
          children: (child as Parent).children,
          data: { _mdxExplicitJsx: true },
        }
      })

      const jsxNode = {
        type: "mdxJsxFlowElement" as const,
        name: "DefinitionList",
        attributes: [],
        children,
        data: { _mdxExplicitJsx: true },
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      parent.children.splice(index, 1, jsxNode)
      return SKIP
    })
  }
}
