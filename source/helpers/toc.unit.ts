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

  it("should exclude [step] headings from TOC", () => {
    const content =
      "## Overview\n\n### Install Dependencies [step]\n\n### Configure Project [step]"
    const toc = extractToc(content)
    expect(toc).toEqual([{ url: "#overview", title: "Overview", depth: 2 }])
  })

  it("should skip headings with [!toc] annotation", () => {
    const content = "## Visible\n\n## Hidden From TOC [!toc]\n\n## Also Visible"
    const toc = extractToc(content)
    expect(toc).toEqual([
      { url: "#visible", title: "Visible", depth: 2 },
      { url: "#also-visible", title: "Also Visible", depth: 2 },
    ])
  })

  it("should include [toc] headings with annotation stripped from title", () => {
    const content = "## Regular\n\n## TOC Only [toc]\n\n## Another"
    const toc = extractToc(content)
    expect(toc).toEqual([
      { url: "#regular", title: "Regular", depth: 2 },
      { url: "#toc-only", title: "TOC Only", depth: 2 },
      { url: "#another", title: "Another", depth: 2 },
    ])
  })
})
