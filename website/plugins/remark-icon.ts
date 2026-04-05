import type { Root } from "mdast"
import type { TextDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Remark plugin that converts :icon text directives into InlineIcon JSX elements */
export const remarkIcon: Plugin<[], Root> = () => {
  return tree => {
    visit(tree, "textDirective", (node: TextDirective, index, parent) => {
      if (node.name !== "icon" || index === undefined || !parent) return

      const name = node.attributes?.name
      if (!name) return

      const className = node.attributes?.className

      const attributes = [
        { type: "mdxJsxAttribute" as const, name: "name", value: name },
        ...(className
          ? [
              {
                type: "mdxJsxAttribute" as const,
                name: "className",
                value: className,
              },
            ]
          : []),
      ]

      const jsxNode = {
        type: "mdxJsxTextElement" as const,
        name: "InlineIcon",
        attributes,
        children: [],
        data: { _mdxExplicitJsx: true },
      }

      // @ts-expect-error mdxJsxTextElement is not in mdast types
      parent.children[index] = jsxNode
    })
  }
}
