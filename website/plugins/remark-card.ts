import type { Root } from "mdast"
import type { ContainerDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit, SKIP } from "unist-util-visit"

/** Remark plugin that converts :::card directives into Card/Cards JSX elements */
export const remarkCard: Plugin<[], Root> = () => {
  return tree => {
    visit(
      tree,
      "containerDirective",
      (node: ContainerDirective, index, parent) => {
        if (node.name !== "card" || index === undefined || !parent) return

        const title = node.attributes?.title ?? ""
        const href = node.attributes?.href
        const icon = node.attributes?.icon

        const attributes = [
          { type: "mdxJsxAttribute" as const, name: "title", value: title },
          ...(href
            ? [{ type: "mdxJsxAttribute" as const, name: "href", value: href }]
            : []),
          ...(icon
            ? [{ type: "mdxJsxAttribute" as const, name: "icon", value: icon }]
            : []),
        ]

        const jsxNode = {
          type: "mdxJsxFlowElement" as const,
          name: "Card",
          attributes,
          children: node.children,
          data: { _mdxExplicitJsx: true },
        }

        // @ts-expect-error mdxJsxFlowElement is not in mdast types
        parent.children[index] = jsxNode
        return SKIP
      },
    )

    const children = tree.children
    let i = 0
    while (i < children.length) {
      const node = children[i]
      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      if (node?.type !== "mdxJsxFlowElement" || node.name !== "Card") {
        i++
        continue
      }

      let j = i + 1
      while (j < children.length) {
        const next = children[j]
        // @ts-expect-error mdxJsxFlowElement is not in mdast types
        if (next?.type !== "mdxJsxFlowElement" || next.name !== "Card") break
        j++
      }

      if (j - i < 2) {
        i++
        continue
      }

      const group = children.slice(i, j)
      const wrapper = {
        type: "mdxJsxFlowElement" as const,
        name: "Cards",
        attributes: [],
        children: group,
        data: { _mdxExplicitJsx: true },
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      children.splice(i, j - i, wrapper)
      i++
    }
  }
}
