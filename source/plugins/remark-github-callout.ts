import type { Blockquote, Paragraph, Root, Text } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

const typeMap: Record<string, string> = {
  NOTE: "note",
  TIP: "tip",
  WARNING: "warning",
  CAUTION: "danger",
  IMPORTANT: "info",
}

const calloutPattern = /^\[!(\w+)\]\s*/

/** Remark plugin that converts GitHub-style blockquote callouts into Callout JSX elements */
export const remarkGithubCallout: Plugin<[], Root> = () => {
  return tree => {
    visit(tree, "blockquote", (node: Blockquote, index, parent) => {
      if (!parent || index === undefined || node.children.length === 0) return

      const first = node.children[0]
      if (first?.type !== "paragraph" || first.children.length === 0) return

      const firstInline = first.children[0]
      if (firstInline?.type !== "text") return

      const match = calloutPattern.exec(firstInline.value)
      if (!match) return

      const rawType = match[1]
      if (!rawType) return

      const calloutType = typeMap[rawType]
      if (!calloutType) return

      const remainingText = firstInline.value.slice(match[0].length)

      const updatedFirstChildren = [
        ...(remainingText
          ? [{ type: "text" as const, value: remainingText } satisfies Text]
          : []),
        ...first.children.slice(1),
      ]

      const body =
        updatedFirstChildren.length > 0
          ? [
              { ...first, children: updatedFirstChildren } satisfies Paragraph,
              ...node.children.slice(1),
            ]
          : node.children.slice(1)

      const jsxNode = {
        type: "mdxJsxFlowElement" as const,
        name: "Callout",
        attributes: [
          {
            type: "mdxJsxAttribute" as const,
            name: "type",
            value: calloutType,
          },
        ],
        children: body,
        data: { _mdxExplicitJsx: true },
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      parent.children.splice(index, 1, jsxNode)
    })
  }
}
