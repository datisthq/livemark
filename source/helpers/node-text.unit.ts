import { describe, expect, it } from "vite-plus/test"
import { readNodeText } from "./node-text.ts"

describe("readNodeText", () => {
  it("joins the text of an mdast heading, code and image alt included", () => {
    const heading = {
      type: "heading",
      children: [
        { type: "text", value: "v1 " },
        { type: "emphasis", children: [{ type: "inlineCode", value: "x" }] },
        { type: "image", alt: " logo" },
      ],
    }
    expect(readNodeText(heading)).toBe("v1 x logo")
  })

  it("reads a hast element's text, leaving comments out", () => {
    const pre = {
      type: "element",
      children: [
        { type: "comment", value: "note" },
        { type: "element", children: [{ type: "text", value: "let a = 1" }] },
      ],
    }
    expect(readNodeText(pre)).toBe("let a = 1")
  })
})
