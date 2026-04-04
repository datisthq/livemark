import type { Heading, Root, Text } from "mdast"
import { describe, expect, it } from "vite-plus/test"
import { transformStepHeadings } from "./remark-steps.ts"

function makeHeading(depth: 1 | 2 | 3 | 4 | 5 | 6, text: string): Heading {
  return { type: "heading", depth, children: [{ type: "text", value: text }] }
}

function makeTree(...children: Root["children"]): Root {
  return { type: "root", children }
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

describe("transformStepHeadings", () => {
  function process(tree: Root) {
    transformStepHeadings(tree)
    return tree
  }

  it("should strip [step] and set data-step attribute", () => {
    const tree = process(
      makeTree(makeHeading(3, "Install Dependencies [step]")),
    )
    const heading = findHeading(tree, 0)
    expect(heading.data?.hProperties).toEqual({ "data-step": 1 })
    expect(headingText(heading)).toBe("Install Dependencies")
  })

  it("should auto-increment step numbers", () => {
    const tree = process(
      makeTree(
        makeHeading(3, "Step One [step]"),
        makeHeading(3, "Step Two [step]"),
        makeHeading(3, "Step Three [step]"),
      ),
    )

    expect(findHeading(tree, 0).data?.hProperties).toEqual({ "data-step": 1 })
    expect(findHeading(tree, 1).data?.hProperties).toEqual({ "data-step": 2 })
    expect(findHeading(tree, 2).data?.hProperties).toEqual({ "data-step": 3 })
  })

  it("should leave headings without [step] unchanged", () => {
    const tree = process(makeTree(makeHeading(2, "Normal Heading")))
    const heading = findHeading(tree, 0)
    expect(heading.data).toBeUndefined()
    expect(headingText(heading)).toBe("Normal Heading")
  })

  it("should only count [step] headings for numbering", () => {
    const tree = process(
      makeTree(
        makeHeading(3, "First [step]"),
        makeHeading(3, "Not a step"),
        makeHeading(3, "Second [step]"),
      ),
    )

    expect(findHeading(tree, 0).data?.hProperties).toEqual({ "data-step": 1 })
    expect(findHeading(tree, 1).data).toBeUndefined()
    expect(findHeading(tree, 2).data?.hProperties).toEqual({ "data-step": 2 })
  })

  it("should handle different heading depths", () => {
    const tree = process(
      makeTree(
        makeHeading(2, "Big Step [step]"),
        makeHeading(4, "Small Step [step]"),
      ),
    )

    expect(findHeading(tree, 0).data?.hProperties).toEqual({ "data-step": 1 })
    expect(findHeading(tree, 1).data?.hProperties).toEqual({ "data-step": 2 })
  })

  it("should preserve existing hProperties", () => {
    const heading = makeHeading(3, "Custom [step]")
    heading.data = { hProperties: { id: "custom-id" } }
    const tree = process(makeTree(heading))
    expect(findHeading(tree, 0).data?.hProperties).toEqual({
      id: "custom-id",
      "data-step": 1,
    })
  })
})
