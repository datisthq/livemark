import type { Root } from "mdast"
import type { LeafDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Walk a mdast tree and convert media leaf directives into JSX embed elements */
export function transformMediaDirectives(tree: Root) {
  visit(tree, "leafDirective", (node: LeafDirective, index, parent) => {
    if (
      (node.name !== "video" && node.name !== "audio") ||
      index === undefined ||
      !parent
    )
      return

    const type = node.attributes?.type
    if (!type) return

    if (node.name === "video" && type === "youtube") {
      const id = node.attributes?.id
      if (!id) return

      const jsxNode = {
        type: "mdxJsxFlowElement" as const,
        name: "YouTube",
        attributes: [
          { type: "mdxJsxAttribute" as const, name: "id", value: id },
        ],
        children: [],
        data: { _mdxExplicitJsx: true },
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      parent.children.splice(index, 1, jsxNode)
    }

    if (node.name === "audio" && type === "soundcloud") {
      const url = node.attributes?.url
      if (!url) return

      const jsxNode = {
        type: "mdxJsxFlowElement" as const,
        name: "SoundCloud",
        attributes: [
          { type: "mdxJsxAttribute" as const, name: "url", value: url },
        ],
        children: [],
        data: { _mdxExplicitJsx: true },
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      parent.children.splice(index, 1, jsxNode)
    }
  })
}

/** Remark plugin that converts leaf directives into media embed JSX elements */
export const remarkMedia: Plugin<[], Root> = () => {
  return tree => {
    transformMediaDirectives(tree)
  }
}
