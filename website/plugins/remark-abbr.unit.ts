import type { Root } from "mdast"
import type { TextDirective } from "mdast-util-directive"
import { describe, expect, it } from "vite-plus/test"
import { transformAbbrDirectives } from "./remark-abbr.ts"

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

describe("transformAbbrDirectives", () => {
  function process(tree: Root) {
    transformAbbrDirectives(tree)
    return tree
  }

  it("should convert :abbr directive to Abbr JSX element", () => {
    const directive = makeTextDirective("abbr", "HTML", {
      title: "HyperText Markup Language",
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
      name: "Abbr",
      attributes: [
        { type: "mdxJsxAttribute", name: "text", value: "HTML" },
        {
          type: "mdxJsxAttribute",
          name: "title",
          value: "HyperText Markup Language",
        },
      ],
      children: [],
    })
  })

  it("should use empty string when title is not provided", () => {
    const directive = makeTextDirective("abbr", "CSS")
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
      name: "Abbr",
      attributes: [
        { type: "mdxJsxAttribute", name: "text", value: "CSS" },
        { type: "mdxJsxAttribute", name: "title", value: "" },
      ],
    })
  })

  it("should ignore non-abbr text directives", () => {
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
