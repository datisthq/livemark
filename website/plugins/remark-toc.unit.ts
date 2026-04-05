import type { Root } from "mdast"
import type { LeafDirective } from "mdast-util-directive"
import { describe, expect, it } from "vite-plus/test"
import { transformTocDirectives } from "./remark-toc.ts"

function makeLeafDirective(
  name: string,
  attributes: Record<string, string> = {},
): LeafDirective {
  return {
    type: "leafDirective" as LeafDirective["type"],
    name,
    attributes,
    children: [],
  }
}

function makeTree(...children: Root["children"]): Root {
  return { type: "root", children }
}

function process(tree: Root) {
  transformTocDirectives(tree)
  return tree
}

describe("transformTocDirectives", () => {
  it("should convert toc directive to InlineToc JSX element", () => {
    const tree = process(makeTree(makeLeafDirective("toc")))
    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "InlineToc",
      attributes: [],
      children: [],
    })
  })

  it("should ignore unrelated leaf directives", () => {
    const tree = process(
      makeTree(makeLeafDirective("video", { type: "youtube" })),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({ type: "leafDirective", name: "video" })
  })

  it("should handle multiple toc directives in the same tree", () => {
    const tree = process(
      makeTree(
        makeLeafDirective("toc"),
        { type: "paragraph", children: [{ type: "text", value: "hello" }] },
        makeLeafDirective("toc"),
      ),
    )
    expect(tree.children[0]).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "InlineToc",
    })
    expect(tree.children[1]).toMatchObject({ type: "paragraph" })
    expect(tree.children[2]).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "InlineToc",
    })
  })

  it("should preserve other children when converting toc directive", () => {
    const tree = process(
      makeTree(
        { type: "paragraph", children: [{ type: "text", value: "before" }] },
        makeLeafDirective("toc"),
        { type: "paragraph", children: [{ type: "text", value: "after" }] },
      ),
    )
    expect(tree.children).toHaveLength(3)
    expect(tree.children[0]).toMatchObject({ type: "paragraph" })
    expect(tree.children[1]).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "InlineToc",
    })
    expect(tree.children[2]).toMatchObject({ type: "paragraph" })
  })
})
