import type { Root } from "mdast"
import type { TextDirective } from "mdast-util-directive"
import { describe, expect, it } from "vite-plus/test"
import { transformBadgeDirectives } from "./remark-badge.ts"

function makeTextDirective(
  name: string,
  text: string,
  attributes?: Record<string, string>,
): TextDirective {
  return {
    type: "textDirective",
    name,
    attributes: attributes ?? {},
    children: [{ type: "text", value: text }],
  }
}

function makeTree(...children: Root["children"]): Root {
  return { type: "root", children }
}

describe("transformBadgeDirectives", () => {
  function process(tree: Root) {
    transformBadgeDirectives(tree)
    return tree
  }

  it("should convert :badge directive to InlineBadge JSX element", () => {
    const directive = makeTextDirective("badge", "Beta")
    const tree = process(
      makeTree({
        type: "paragraph",
        children: [directive],
      }),
    )

    const paragraph = tree.children[0]
    if (!paragraph || paragraph.type !== "paragraph")
      throw new Error("Expected paragraph")
    const node = paragraph.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxTextElement",
      name: "InlineBadge",
      attributes: [{ type: "mdxJsxAttribute", name: "label", value: "Beta" }],
      children: [],
    })
  })

  it("should pass variant attribute when provided", () => {
    const directive = makeTextDirective("badge", "Deprecated", {
      variant: "destructive",
    })
    const tree = process(
      makeTree({
        type: "paragraph",
        children: [directive],
      }),
    )

    const paragraph = tree.children[0]
    if (!paragraph || paragraph.type !== "paragraph")
      throw new Error("Expected paragraph")
    const node = paragraph.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxTextElement",
      name: "InlineBadge",
      attributes: [
        { type: "mdxJsxAttribute", name: "label", value: "Deprecated" },
        {
          type: "mdxJsxAttribute",
          name: "variant",
          value: "destructive",
        },
      ],
    })
  })

  it("should ignore non-badge text directives", () => {
    const directive = makeTextDirective("other", "Text")
    const tree = process(
      makeTree({
        type: "paragraph",
        children: [directive],
      }),
    )

    const paragraph = tree.children[0]
    if (!paragraph || paragraph.type !== "paragraph")
      throw new Error("Expected paragraph")
    expect(paragraph.children[0]).toMatchObject({
      type: "textDirective",
      name: "other",
    })
  })
})
