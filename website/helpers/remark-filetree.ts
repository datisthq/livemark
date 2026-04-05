import type { List, ListItem, Paragraph, Root, Text } from "mdast"
import type { ContainerDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit, SKIP } from "unist-util-visit"

interface TreeItem {
  name: string
  isDir: boolean
  children?: TreeItem[]
}

/** Extract tree items from a mdast list node */
export function parseList(list: List): TreeItem[] {
  const items: TreeItem[] = []

  for (const listItem of list.children) {
    if (listItem.type !== "listItem") continue
    const item = parseListItem(listItem)
    if (item) items.push(item)
  }

  return items
}

function parseListItem(listItem: ListItem): TreeItem | undefined {
  const paragraph = listItem.children.find(
    (child): child is Paragraph => child.type === "paragraph",
  )
  if (!paragraph) return undefined

  const textContent = paragraph.children
    .filter((c): c is Text => c.type === "text")
    .map(c => c.value)
    .join("")
    .trim()

  if (!textContent) return undefined

  const isDir = textContent.endsWith("/")
  const name = isDir ? textContent.slice(0, -1) : textContent

  const nestedList = listItem.children.find(
    (child): child is List => child.type === "list",
  )

  const children = nestedList ? parseList(nestedList) : undefined

  return { name, isDir, children }
}

/** Remark plugin that converts :::filetree directives into FileTree JSX elements */
export const remarkFiletree: Plugin<[], Root> = () => {
  return tree => {
    visit(
      tree,
      "containerDirective",
      (node: ContainerDirective, index, parent) => {
        if (node.name !== "filetree" || index === undefined || !parent) return

        const lists = node.children.filter(
          (child): child is List => child.type === "list",
        )

        const treeItems: TreeItem[] = []
        for (const list of lists) {
          treeItems.push(...parseList(list))
        }

        const jsxNode = {
          type: "mdxJsxFlowElement" as const,
          name: "FileTree",
          attributes: [
            {
              type: "mdxJsxAttribute" as const,
              name: "tree",
              value: JSON.stringify(treeItems),
            },
          ],
          children: [],
          data: { _mdxExplicitJsx: true },
        }

        // @ts-expect-error mdxJsxFlowElement is not in mdast types
        parent.children[index] = jsxNode
        return SKIP
      },
    )
  }
}
