import type { Heading, Root, Text } from "mdast"
import { describe, expect, it } from "vite-plus/test"
import {
  transformCustomHeadingIds,
  transformHeadingAnnotations,
} from "./remark-custom-heading-id.ts"

function makeHeading(depth: 1 | 2 | 3 | 4 | 5 | 6, text: string): Heading {
  return { type: "heading", depth, children: [{ type: "text", value: text }] }
}

function makeBoldHeading(boldText: string, trailingText: string): Heading {
  return {
    type: "heading",
    depth: 2,
    children: [
      { type: "strong", children: [{ type: "text", value: boldText }] },
      { type: "text", value: trailingText },
    ],
  }
}

function makeTree(...headings: Heading[]): Root {
  return { type: "root", children: headings }
}

function findHeading(tree: Root, index: number): Heading {
  const node = tree.children[index]
  if (!node || node.type !== "heading") throw new Error("No heading at index")
  return node
}

function headingText(heading: Heading): string {
  return heading.children
    .filter((c): c is Text => c.type === "text")
    .map(c => c.value)
    .join("")
}

describe("transformHeadingAnnotations", () => {
  function process(tree: Root) {
    transformHeadingAnnotations(tree)
    return tree
  }

  it("should set a custom id from [#custom-id] syntax", () => {
    const tree = process(makeTree(makeHeading(2, "My Heading [#custom-id]")))
    const heading = findHeading(tree, 0)
    expect(heading.data?.hProperties).toEqual({ id: "custom-id" })
    expect(headingText(heading)).toBe("My Heading")
  })

  it("should leave headings without custom ids unchanged", () => {
    const tree = process(makeTree(makeHeading(2, "Normal Heading")))
    const heading = findHeading(tree, 0)
    expect(heading.data).toBeUndefined()
    expect(headingText(heading)).toBe("Normal Heading")
  })

  it("should handle different heading depths", () => {
    const tree = process(
      makeTree(
        makeHeading(3, "Deep Heading [#deep]"),
        makeHeading(4, "Deeper Heading [#deeper]"),
      ),
    )

    const h3 = findHeading(tree, 0)
    expect(h3.data?.hProperties).toEqual({ id: "deep" })
    expect(h3.depth).toBe(3)

    const h4 = findHeading(tree, 1)
    expect(h4.data?.hProperties).toEqual({ id: "deeper" })
    expect(h4.depth).toBe(4)
  })

  it("should handle ids with hyphens and numbers", () => {
    const tree = process(
      makeTree(makeHeading(2, "Section 1 [#section-1-intro]")),
    )
    const heading = findHeading(tree, 0)
    expect(heading.data?.hProperties).toEqual({ id: "section-1-intro" })
    expect(headingText(heading)).toBe("Section 1")
  })

  it("should preserve inline formatting before the id", () => {
    const tree = process(
      makeTree(makeBoldHeading("Bold", " heading [#bold-heading]")),
    )
    const heading = findHeading(tree, 0)
    expect(heading.data?.hProperties).toEqual({ id: "bold-heading" })
    expect(heading.children.some(c => c.type === "strong")).toBe(true)
    expect(headingText(heading)).toBe(" heading")
  })

  it("should add data-toc-hidden for [!toc] headings", () => {
    const tree = process(makeTree(makeHeading(2, "Hidden Heading [!toc]")))
    const heading = findHeading(tree, 0)
    expect(heading.data?.hProperties).toEqual({ "data-toc-hidden": true })
    expect(headingText(heading)).toBe("Hidden Heading")
  })

  it("should remove [toc] headings from the tree", () => {
    const tree = process(
      makeTree(
        makeHeading(2, "Visible Heading"),
        makeHeading(2, "TOC Only Heading [toc]"),
        makeHeading(3, "Another Visible"),
      ),
    )
    expect(tree.children).toHaveLength(2)
    expect(headingText(findHeading(tree, 0))).toBe("Visible Heading")
    expect(headingText(findHeading(tree, 1))).toBe("Another Visible")
  })

  it("should remove consecutive [toc] headings correctly", () => {
    const tree = process(
      makeTree(
        makeHeading(2, "First [toc]"),
        makeHeading(2, "Second [toc]"),
        makeHeading(2, "Kept"),
      ),
    )
    expect(tree.children).toHaveLength(1)
    expect(headingText(findHeading(tree, 0))).toBe("Kept")
  })

  it("should be available as transformCustomHeadingIds for backward compatibility", () => {
    expect(transformCustomHeadingIds).toBe(transformHeadingAnnotations)
  })
})
