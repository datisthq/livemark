import type { Root } from "mdast"
import type { LeafDirective } from "mdast-util-directive"
import { describe, expect, it } from "vite-plus/test"
import { transformButtonDirectives } from "./remark-button.ts"

function makeLeafDirective(
  name: string,
  attributes: Record<string, string>,
  children: LeafDirective["children"] = [],
): LeafDirective {
  return {
    type: "leafDirective" as LeafDirective["type"],
    name,
    attributes,
    children,
  }
}

function makeTree(...children: Root["children"]): Root {
  return { type: "root", children }
}

function process(tree: Root) {
  transformButtonDirectives(tree)
  return tree
}

describe("transformButtonDirectives", () => {
  it("should convert ::button with bracket text to LinkButton JSX element", () => {
    const tree = process(
      makeTree(
        makeLeafDirective("button", { href: "/start" }, [
          { type: "text", value: "Get Started" },
        ]),
      ),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "LinkButton",
      attributes: [
        { type: "mdxJsxAttribute", name: "href", value: "/start" },
        { type: "mdxJsxAttribute", name: "label", value: "Get Started" },
      ],
    })
  })

  it("should convert ::button with label attribute to LinkButton JSX element", () => {
    const tree = process(
      makeTree(
        makeLeafDirective("button", { href: "/docs", label: "Read Docs" }),
      ),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "LinkButton",
      attributes: [
        { type: "mdxJsxAttribute", name: "href", value: "/docs" },
        { type: "mdxJsxAttribute", name: "label", value: "Read Docs" },
      ],
    })
  })

  it("should prefer bracket text over label attribute", () => {
    const tree = process(
      makeTree(
        makeLeafDirective("button", { href: "/x", label: "Fallback" }, [
          { type: "text", value: "Primary" },
        ]),
      ),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "LinkButton",
      attributes: [
        { type: "mdxJsxAttribute", name: "href", value: "/x" },
        { type: "mdxJsxAttribute", name: "label", value: "Primary" },
      ],
    })
  })

  it("should pass variant attribute when provided", () => {
    const tree = process(
      makeTree(
        makeLeafDirective("button", { href: "/a", variant: "outline" }, [
          { type: "text", value: "Click" },
        ]),
      ),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "LinkButton",
      attributes: [
        { type: "mdxJsxAttribute", name: "href", value: "/a" },
        { type: "mdxJsxAttribute", name: "label", value: "Click" },
        { type: "mdxJsxAttribute", name: "variant", value: "outline" },
      ],
    })
  })

  it("should pass size attribute when provided", () => {
    const tree = process(
      makeTree(
        makeLeafDirective("button", { href: "/a", size: "lg" }, [
          { type: "text", value: "Big" },
        ]),
      ),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "LinkButton",
      attributes: [
        { type: "mdxJsxAttribute", name: "href", value: "/a" },
        { type: "mdxJsxAttribute", name: "label", value: "Big" },
        { type: "mdxJsxAttribute", name: "size", value: "lg" },
      ],
    })
  })

  it("should skip button directive without href", () => {
    const tree = process(
      makeTree(makeLeafDirective("button", { label: "No Link" })),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({ type: "leafDirective", name: "button" })
  })

  it("should skip button directive without label or bracket text", () => {
    const tree = process(
      makeTree(makeLeafDirective("button", { href: "/no-label" })),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({ type: "leafDirective", name: "button" })
  })

  it("should ignore unrelated leaf directives", () => {
    const tree = process(
      makeTree(makeLeafDirective("video", { type: "youtube", id: "abc" })),
    )
    const node = tree.children[0]
    expect(node).toMatchObject({ type: "leafDirective", name: "video" })
  })
})
