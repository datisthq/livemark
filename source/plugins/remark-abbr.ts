import type { Root } from "mdast"
import type { TextDirective } from "mdast-util-directive"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/** Walk a mdast tree and convert :abbr text directives into Abbr JSX elements */
export function transformAbbrDirectives(tree: Root) {
  visit(tree, "textDirective", (node: TextDirective, index, parent) => {
    if (node.name !== "abbr" || index === undefined || !parent) return

    const text = node.children
      .map(c => ("value" in c ? String(c.value) : ""))
      .join("")

    const title = node.attributes?.title ?? ""

    const jsxNode = {
      type: "mdxJsxTextElement" as const,
      name: "Abbr",
      attributes: [
        {
          type: "mdxJsxAttribute" as const,
          name: "text",
          value: text,
        },
        {
          type: "mdxJsxAttribute" as const,
          name: "title",
          value: title,
        },
      ],
      children: [],
      data: { _mdxExplicitJsx: true },
    }

    // @ts-expect-error mdxJsxTextElement is not in mdast types
    parent.children.splice(index, 1, jsxNode)
  })
}

/** Remark plugin that converts :abbr text directives into Abbr JSX elements */
export const remarkAbbr: Plugin<[], Root> = () => {
  return tree => {
    transformAbbrDirectives(tree)
  }
}
