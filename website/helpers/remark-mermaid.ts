import type { Root } from "mdast"
import type { Plugin } from "unified"

/** Remark plugin that converts mermaid code blocks into Mermaid components */
export const remarkMermaid: Plugin<[], Root> = () => {
  return tree => {
    const children = tree.children
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      if (node?.type !== "code" || node.lang !== "mermaid") continue

      const jsxNode = {
        type: "mdxJsxFlowElement" as const,
        name: "Mermaid",
        attributes: [
          {
            type: "mdxJsxAttribute" as const,
            name: "chart",
            value: node.value,
          },
        ],
        children: [],
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      children[i] = jsxNode
    }
  }
}
