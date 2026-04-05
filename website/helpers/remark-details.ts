import type { Paragraph, Root } from "mdast"
import type { ContainerDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Remark plugin that converts :::details directives into collapsible details/summary elements */
export const remarkDetails: Plugin<[], Root> = () => {
  return tree => {
    visit(
      tree,
      "containerDirective",
      (node: ContainerDirective, index, parent) => {
        if (node.name !== "details" || index === undefined || !parent) return

        const labelParagraph = node.children.find(
          (child): child is Paragraph =>
            child.type === "paragraph" && !!child.data?.directiveLabel,
        )

        const summary = labelParagraph
          ? labelParagraph.children
              .map(c => ("value" in c ? String(c.value) : ""))
              .join("")
          : "Details"

        const body = node.children.filter(
          child => !(child.type === "paragraph" && child.data?.directiveLabel),
        )

        const jsxNode = {
          type: "mdxJsxFlowElement" as const,
          name: "Details",
          attributes: [
            {
              type: "mdxJsxAttribute" as const,
              name: "summary",
              value: summary,
            },
          ],
          children: body,
          data: { _mdxExplicitJsx: true },
        }

        // @ts-expect-error mdxJsxFlowElement is not in mdast types
        parent.children.splice(index, 1, jsxNode)
      },
    )
  }
}
