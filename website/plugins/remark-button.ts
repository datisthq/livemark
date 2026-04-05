import type { Root } from "mdast"
import type { LeafDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Walk a mdast tree and convert ::button leaf directives into LinkButton JSX elements */
export function transformButtonDirectives(tree: Root) {
  visit(tree, "leafDirective", (node: LeafDirective, index, parent) => {
    if (node.name !== "button" || index === undefined || !parent) return

    const label =
      node.children.map(c => ("value" in c ? String(c.value) : "")).join("") ||
      node.attributes?.label

    const href = node.attributes?.href
    if (!href || !label) return

    const variant = node.attributes?.variant
    const size = node.attributes?.size

    const jsxNode = {
      type: "mdxJsxFlowElement" as const,
      name: "LinkButton",
      attributes: [
        { type: "mdxJsxAttribute" as const, name: "href", value: href },
        { type: "mdxJsxAttribute" as const, name: "label", value: label },
        ...(variant
          ? [
              {
                type: "mdxJsxAttribute" as const,
                name: "variant",
                value: variant,
              },
            ]
          : []),
        ...(size
          ? [
              {
                type: "mdxJsxAttribute" as const,
                name: "size",
                value: size,
              },
            ]
          : []),
      ],
      children: [],
      data: { _mdxExplicitJsx: true },
    }

    // @ts-expect-error mdxJsxFlowElement is not in mdast types
    parent.children.splice(index, 1, jsxNode)
  })
}

/** Remark plugin that converts ::button leaf directives into LinkButton JSX elements */
export const remarkButton: Plugin<[], Root> = () => {
  return tree => {
    transformButtonDirectives(tree)
  }
}
