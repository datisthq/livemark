import type { Root } from "mdast"
import type { ContainerDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit, SKIP } from "unist-util-visit"

/** Walk a mdast tree and convert :::tab directives into ContentTab/ContentTabs JSX elements */
export function transformTabDirectives(tree: Root) {
  visit(
    tree,
    "containerDirective",
    (node: ContainerDirective, index, parent) => {
      if (node.name !== "tab" || index === undefined || !parent) return

      const title = node.attributes?.title ?? ""

      const jsxNode = {
        type: "mdxJsxFlowElement" as const,
        name: "ContentTab",
        attributes: [
          { type: "mdxJsxAttribute" as const, name: "title", value: title },
        ],
        children: node.children,
        data: { _mdxExplicitJsx: true },
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      parent.children[index] = jsxNode
      return SKIP
    },
  )

  const children = tree.children
  let i = 0
  while (i < children.length) {
    const node = children[i]
    // @ts-expect-error mdxJsxFlowElement is not in mdast types
    if (node?.type !== "mdxJsxFlowElement" || node.name !== "ContentTab") {
      i++
      continue
    }

    let j = i + 1
    while (j < children.length) {
      const next = children[j]
      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      if (next?.type !== "mdxJsxFlowElement" || next.name !== "ContentTab")
        break
      j++
    }

    const group = children.slice(i, j)
    const wrapper = {
      type: "mdxJsxFlowElement" as const,
      name: "ContentTabs",
      attributes: [],
      children: group,
      data: { _mdxExplicitJsx: true },
    }

    // @ts-expect-error mdxJsxFlowElement is not in mdast types
    children.splice(i, j - i, wrapper)
    i++
  }
}

/** Remark plugin that converts :::tab directives into ContentTab/ContentTabs JSX elements */
export const remarkTab: Plugin<[], Root> = () => {
  return tree => {
    transformTabDirectives(tree)
  }
}
