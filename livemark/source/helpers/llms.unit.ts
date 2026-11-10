import { describe, expect, it } from "vite-plus/test"
import type { RoutedSection } from "../models/section.ts"
import {
  buildTwinFileName,
  renderLlmsText,
  renderMarkdownTwin,
  renderSectionIndex,
  stripLeadingH1,
} from "./llms.ts"

const config = { title: "Docs", description: "Blurb" }

describe("renderLlmsText", () => {
  it("lists articles in sidebar order under a single heading without sections", () => {
    const text = renderLlmsText({
      config,
      articles: [
        { path: "/guide/", title: "Guide", order: 2 },
        { path: "/intro/", title: "Intro", description: "Start here", order: 1 },
        { path: "/guide/deep/", title: "Deep" },
      ],
    })
    expect(text).toBe(
      [
        "# Docs",
        "",
        "> Blurb",
        "",
        "## Pages",
        "",
        "- [Intro](/intro/index.md): Start here",
        "- [Guide](/guide/index.md)",
        "- [Deep](/guide/deep/index.md)",
        "",
      ].join("\n"),
    )
  })

  it("groups by routed section, newest first in a blog, with absolute urls", () => {
    const text = renderLlmsText({
      config: {
        ...config,
        site: "https://example.com/",
        base: "/repo",
        sections: [
          { title: "Docs", prefix: "/", type: "article", position: "header" },
          { title: "Blog", prefix: "/blog/", type: "blog", position: "header" },
          {
            title: "GitHub",
            url: "https://github.com",
            type: "custom",
            position: "header",
          },
        ],
      },
      articles: [
        { path: "/blog/old/", title: "Old", date: "2026-01-01" },
        { path: "/intro/", title: "Intro" },
        { path: "/blog/new/", title: "New", date: "2026-02-01" },
      ],
    })
    expect(text).toContain(
      [
        "## Docs",
        "",
        "- [Intro](https://example.com/repo/intro/index.md)",
        "",
        "## Blog",
        "",
        "- [New](https://example.com/repo/blog/new/index.md)",
        "- [Old](https://example.com/repo/blog/old/index.md)",
      ].join("\n"),
    )
    expect(text).not.toContain("GitHub")
  })
})

describe("renderSectionIndex", () => {
  it("lists only the section's articles, newest first", () => {
    const blog: RoutedSection = {
      title: "Blog",
      prefix: "/blog/",
      type: "blog",
      position: "header",
    }
    const text = renderSectionIndex({
      config: { sections: [blog] },
      section: blog,
      articles: [
        { path: "/intro/", title: "Intro" },
        { path: "/blog/old/", title: "Old", date: "2026-01-01" },
        { path: "/blog/new/", title: "New", date: "2026-02-01", description: "Fresh" },
      ],
    })
    expect(text).toBe(
      "# Blog\n\n- [New](/blog/new/index.md): Fresh\n- [Old](/blog/old/index.md)\n",
    )
  })
})

describe("renderMarkdownTwin", () => {
  it("leads with the title and description instead of the body's own h1", () => {
    const twin = renderMarkdownTwin({
      article: { path: "/intro/", title: "Introduction", description: "Start here" },
      content: "# Livemark\n\nBody text\n",
    })
    expect(twin).toBe("# Introduction\n\n> Start here\n\nBody text\n")
  })
})

describe("buildTwinFileName", () => {
  it("places the twin beside the page's index.html", () => {
    expect(buildTwinFileName("/")).toBe("index.md")
    expect(buildTwinFileName("/guide/deep/")).toBe("guide/deep/index.md")
  })
})

describe("stripLeadingH1", () => {
  it("drops the leading h1 with the blank lines after it", () => {
    expect(stripLeadingH1("# Title\n\nBody")).toBe("Body")
  })

  it("drops an h1 that is the whole body", () => {
    expect(stripLeadingH1("# Title")).toBe("")
  })

  it("keeps a body that opens with another heading", () => {
    expect(stripLeadingH1("## Part\n\nBody")).toBe("## Part\n\nBody")
  })
})
