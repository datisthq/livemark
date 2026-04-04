import { dirname, relative, resolve } from "node:path"
import type { Image, Root } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Remark plugin that resolves relative image paths to URLs serveable by Vite */
export const remarkImage: Plugin<
  [{ filePath: string; root: string }],
  Root
> = ({ filePath, root }) => {
  const fileDir = dirname(filePath)

  return tree => {
    visit(tree, "image", (node: Image) => {
      if (node.url.startsWith("http") || node.url.startsWith("/")) return
      const absolute = resolve(fileDir, node.url)
      node.url = "/" + relative(root, absolute)
    })
  }
}
