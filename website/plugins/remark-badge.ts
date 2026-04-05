import type { Root } from "mdast"
import type { TextDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Walk a mdast tree and convert :badge text directives into InlineBadge JSX elements */
export function transformBadgeDirectives(tree: Root) {
  visit(tree, "textDirective", (node: TextDirective, index, parent) => {
    if (node.name !== "badge" || index === undefined || !parent) return

    const label = node.children
      .map(c => ("value" in c ? String(c.value) : ""))
      .join("")

    const variant = node.attributes?.variant

    const jsxNode = {
      type: "mdxJsxTextElement" as const,
      name: "InlineBadge",
      attributes: [
        {
          type: "mdxJsxAttribute" as const,
          name: "label",
          value: label,
        },
        ...(variant
          ? [
              {
                type: "mdxJsxAttribute" as const,
                name: "variant",
                value: variant,
              },
            ]
          : []),
      ],
      children: [],
      data: { _mdxExplicitJsx: true },
    }

    // @ts-expect-error mdxJsxTextElement is not in mdast types
    parent.children.splice(index, 1, jsxNode)
  })
}

/** Remark plugin that converts :badge text directives into InlineBadge JSX elements */
export const remarkBadge: Plugin<[], Root> = () => {
  return tree => {
    transformBadgeDirectives(tree)
  }
}
