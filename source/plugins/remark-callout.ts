import type { Paragraph, Root } from "mdast"
import type { ContainerDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

const calloutTypes = new Set(["note", "tip", "info", "warning", "danger"])

/** Remark plugin that converts container directives into Callout JSX elements */
export const remarkCallout: Plugin<[], Root> = () => {
  return tree => {
    visit(
      tree,
      "containerDirective",
      (node: ContainerDirective, index, parent) => {
        if (!calloutTypes.has(node.name) || index === undefined || !parent)
          return

        const labelParagraph = node.children.find(
          (child): child is Paragraph =>
            child.type === "paragraph" && !!child.data?.directiveLabel,
        )

        const title = labelParagraph
          ? {
              type: "mdxJsxAttribute" as const,
              name: "title",
              value: labelParagraph.children
                .map(c => ("value" in c ? String(c.value) : ""))
                .join(""),
            }
          : undefined

        const body = node.children.filter(
          child => !(child.type === "paragraph" && child.data?.directiveLabel),
        )

        const jsxNode = {
          type: "mdxJsxFlowElement" as const,
          name: "Callout",
          attributes: [
            {
              type: "mdxJsxAttribute" as const,
              name: "type",
              value: node.name,
            },
            ...(title ? [title] : []),
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
