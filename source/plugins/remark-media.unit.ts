import type { Root } from "mdast"
import type { LeafDirective } from "mdast-util-directive"
import { describe, expect, it } from "vite-plus/test"
import { transformMediaDirectives } from "./remark-media.ts"

function makeLeafDirective(
  name: string,
  attributes: Record<string, string>,
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
  transformMediaDirectives(tree)
  return tree
}

describe("transformMediaDirectives", () => {
  it("should convert video youtube directive to YouTube JSX element", () => {
    const tree = process(
      makeTree(makeLeafDirective("video", { type: "youtube", id: "abc123" })),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "YouTube",
      attributes: [{ type: "mdxJsxAttribute", name: "id", value: "abc123" }],
    })
  })

  it("should convert audio soundcloud directive to SoundCloud JSX element", () => {
    const url = "https://soundcloud.com/artist/track"
    const tree = process(
      makeTree(makeLeafDirective("audio", { type: "soundcloud", url })),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "SoundCloud",
      attributes: [{ type: "mdxJsxAttribute", name: "url", value: url }],
    })
  })

  it("should skip video directive without type", () => {
    const tree = process(makeTree(makeLeafDirective("video", { id: "abc123" })))
    const node = tree.children[0]
    expect(node).toMatchObject({ type: "leafDirective", name: "video" })
  })

  it("should skip audio directive without url", () => {
    const tree = process(
      makeTree(makeLeafDirective("audio", { type: "soundcloud" })),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({ type: "leafDirective", name: "audio" })
  })

  it("should ignore unrelated leaf directives", () => {
    const tree = process(
      makeTree(makeLeafDirective("include", { file: "test.md" })),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({ type: "leafDirective", name: "include" })
  })
})
