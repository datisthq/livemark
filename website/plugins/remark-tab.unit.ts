import type { Root } from "mdast"
import type { ContainerDirective } from "mdast-util-directive"
import { describe, expect, it } from "vite-plus/test"
import { transformTabDirectives } from "./remark-tab.ts"

function makeContainerDirective(
  name: string,
  attributes?: Record<string, string>,
): ContainerDirective {
  return {
    type: "containerDirective",
    name,
    attributes: attributes ?? {},
    children: [
      { type: "paragraph", children: [{ type: "text", value: "content" }] },
    ],
  }
}

function makeTree(...children: Root["children"]): Root {
  return { type: "root", children }
}

describe("transformTabDirectives", () => {
  function process(tree: Root) {
    transformTabDirectives(tree)
    return tree
  }

  it("should convert :::tab directive to ContentTab JSX element", () => {
    const directive = makeContainerDirective("tab", { title: "React" })
    const tree = process(makeTree(directive))

    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "ContentTabs",
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "ContentTab",
          attributes: [
            { type: "mdxJsxAttribute", name: "title", value: "React" },
          ],
        },
      ],
    })
  })

  it("should default title to empty string when not provided", () => {
    const directive = makeContainerDirective("tab")
    const tree = process(makeTree(directive))

    const wrapper = tree.children[0]
    expect(wrapper).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "ContentTabs",
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "ContentTab",
          attributes: [{ type: "mdxJsxAttribute", name: "title", value: "" }],
        },
      ],
    })
  })

  it("should ignore non-tab container directives", () => {
    const directive = makeContainerDirective("note")
    const tree = process(makeTree(directive))

    expect(tree.children[0]).toMatchObject({
      type: "containerDirective",
      name: "note",
    })
  })

  it("should wrap a single ContentTab in ContentTabs", () => {
    const directive = makeContainerDirective("tab", { title: "Only" })
    const tree = process(makeTree(directive))

    expect(tree.children).toHaveLength(1)
    expect(tree.children[0]).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "ContentTabs",
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "ContentTab",
        },
      ],
    })
  })

  it("should group consecutive tabs into a single ContentTabs wrapper", () => {
    const tab1 = makeContainerDirective("tab", { title: "React" })
    const tab2 = makeContainerDirective("tab", { title: "Vue" })
    const tab3 = makeContainerDirective("tab", { title: "Svelte" })
    const tree = process(makeTree(tab1, tab2, tab3))

    expect(tree.children).toHaveLength(1)
    const wrapper = tree.children[0]
    expect(wrapper).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "ContentTabs",
    })
    // @ts-expect-error mdxJsxFlowElement is not in mdast types
    expect(wrapper.children).toHaveLength(3)
  })

  it("should not group tabs separated by other elements", () => {
    const tab1 = makeContainerDirective("tab", { title: "A" })
    const separator = {
      type: "paragraph" as const,
      children: [{ type: "text" as const, value: "break" }],
    }
    const tab2 = makeContainerDirective("tab", { title: "B" })
    const tree = process(makeTree(tab1, separator, tab2))

    expect(tree.children).toHaveLength(3)
    expect(tree.children[0]).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "ContentTabs",
    })
    expect(tree.children[1]).toMatchObject({ type: "paragraph" })
    expect(tree.children[2]).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "ContentTabs",
    })
  })
})
