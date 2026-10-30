import { describe, expect, it } from "vite-plus/test"
import { parseFrontmatter } from "./frontmatter.ts"

describe("parseFrontmatter", () => {
  it("splits the YAML block from the trimmed body", () => {
    expect(parseFrontmatter("---\ntitle: A\norder: 2\n---\n\n# Body\n")).toEqual({
      data: { title: "A", order: 2 },
      content: "# Body",
    })
  })

  it("reads an empty block, CRLF endings and a BOM", () => {
    expect(parseFrontmatter("---\n---\nBody")).toEqual({ data: {}, content: "Body" })
    expect(parseFrontmatter("﻿---\r\ntitle: A\r\n---\r\nBody")).toEqual({
      data: { title: "A" },
      content: "Body",
    })
  })

  it("leaves a file without frontmatter, or a later rule, as body", () => {
    expect(parseFrontmatter("# T\n\n---\n\nx")).toEqual({
      data: {},
      content: "# T\n\n---\n\nx",
    })
  })

  it("closes only on a line of its own", () => {
    expect(parseFrontmatter("---\ntitle: a---\n---\nBody").data).toEqual({
      title: "a---",
    })
  })
})
