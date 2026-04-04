import { describe, expect, it } from "vite-plus/test"
import { extractToc } from "./toc.ts"

describe("extractToc", () => {
  it("should extract headings with auto-generated slugs", () => {
    const content = "## Introduction\n\n### Getting Started"
    const toc = extractToc(content)
    expect(toc).toEqual([
      { url: "#introduction", title: "Introduction", depth: 2 },
      { url: "#getting-started", title: "Getting Started", depth: 3 },
    ])
  })

  it("should use custom id when [#custom-id] syntax is present", () => {
    const content = "## My Section [#custom-id]\n\n### Sub Section"
    const toc = extractToc(content)
    expect(toc).toEqual([
      { url: "#custom-id", title: "My Section", depth: 2 },
      { url: "#sub-section", title: "Sub Section", depth: 3 },
    ])
  })

  it("should strip [#id] from the displayed title", () => {
    const content = "## Installation [#install]"
    const toc = extractToc(content)
    expect(toc).toEqual([{ url: "#install", title: "Installation", depth: 2 }])
  })

  it("should handle inline formatting with custom ids", () => {
    const content = "## **Bold** Title [#bold-title]"
    const toc = extractToc(content)
    expect(toc).toEqual([{ url: "#bold-title", title: "Bold Title", depth: 2 }])
  })

  it("should handle code formatting with custom ids", () => {
    const content = "## `config` Options [#config-opts]"
    const toc = extractToc(content)
    expect(toc).toEqual([
      { url: "#config-opts", title: "config Options", depth: 2 },
    ])
  })

  it("should skip h1 headings", () => {
    const content = "# Title\n\n## Section"
    const toc = extractToc(content)
    expect(toc).toEqual([{ url: "#section", title: "Section", depth: 2 }])
  })
})
