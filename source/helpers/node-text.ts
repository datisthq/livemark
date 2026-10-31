/** A syntax-tree node as `readNodeText` reads it, mdast or hast alike. */
export interface TextNode {
  type: string
  value?: unknown
  alt?: unknown
  children?: TextNode[]
}

/** A node's text: its own value, an image's alt, else its children's text joined. */
export function readNodeText(node: TextNode): string {
  if (typeof node.value === "string" && node.type !== "comment") return node.value
  if (node.type === "image") return typeof node.alt === "string" ? node.alt : ""
  return node.children?.map(readNodeText).join("") ?? ""
}
