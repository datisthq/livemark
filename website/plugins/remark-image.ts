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
        child =>
          child.type === "image" ||
          child.type === "imageReference" ||
          child.type === "break" ||
          (child.type === "text" && child.value.trim() === ""),
      )
      if (!isImageOnly) return
      const images = node.children.filter(
        child => child.type === "image" || child.type === "imageReference",
      )
      if (images.length === 0) return
      parent.children.splice(index, 1, ...images)
      return index + images.length
    })
  }
}
