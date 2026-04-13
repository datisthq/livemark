import type { Root } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"
import { resolveAssetPath } from "../helpers/resolve-asset-path.ts"

/** Remark plugin that resolves relative image paths and unwraps image-only paragraphs */
export const remarkImage: Plugin<
  [{ filePath: string; root: string }],
  Root
> = ({ filePath, root }) => {
  return tree => {
    visit(tree, "image", node => {
      node.url = resolveAssetPath(node.url, filePath, root)
    })

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || typeof index !== "number") return
      const isImageOnly = node.children.every(
        child => child.type === "image" || child.type === "imageReference",
      )
      if (!isImageOnly || node.children.length === 0) return
      parent.children.splice(index, 1, ...node.children)
      return index + node.children.length
    })
  }
}
