import { describe, expect, it } from "vite-plus/test"
import { renderInlineMarkdown } from "./render-inline-markdown.ts"

describe("renderInlineMarkdown", () => {
  it("should render plain text without a paragraph", () => {
    expect(renderInlineMarkdown("Hello world", undefined)).toBe("Hello world")
  })

  it("should render bold, emphasis and code", () => {
    expect(renderInlineMarkdown("**a** _b_ `c`", undefined)).toBe(
      "<strong>a</strong> <em>b</em> <code>c</code>",
    )
  })

  it("should open absolute links in a new tab", () => {
    expect(renderInlineMarkdown("[x](https://example.com)", undefined)).toBe(
      '<a href="https://example.com" rel="noopener noreferrer" target="_blank">x</a>',
    )
  })

  it("should prefix root-relative links with the base", () => {
    expect(renderInlineMarkdown("[x](/blog/)", "/repo")).toBe(
      '<a href="/repo/blog/">x</a>',
    )
  })

  it("should drop raw HTML tags", () => {
    expect(renderInlineMarkdown("a <b onclick=x>c</b>", undefined)).toBe("a c")
  })
})
