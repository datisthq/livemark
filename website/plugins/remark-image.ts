import { dirname, relative, resolve } from "node:path"
import type { Root } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Remark plugin that resolves relative image paths and unwraps image-only paragraphs */
export const remarkImage: Plugin<
  [{ filePath: string; root: string }],
  Root
> = ({ filePath, root }) => {
  const fileDir = dirname(filePath)

  return tree => {
    visit(tree, "image", node => {
      if (
        node.url.startsWith("http") ||
        node.url.startsWith("/") ||
        node.url.startsWith("data:")
      )
        return
      const absolute = resolve(fileDir, node.url)
      node.url = "/" + relative(root, absolute)
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
