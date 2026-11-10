import { describe, expect, it } from "vite-plus/test"
import { compileMarkdown, detectMarkdownFormat } from "./compile.ts"

describe("compileMarkdown", () => {
  it("compiles a program module or a function body", async () => {
    const compile = (outputFormat: "program" | "function-body") =>
      compileMarkdown({
        content: "## A",
        filePath: "/a.md",
        format: "md",
        outputFormat,
        options: {},
      })
    expect((await compile("program")).code).toContain(
      "export default function MDXContent",
    )
    expect((await compile("function-body")).code).toContain("arguments[0]")
    expect((await compile("program")).toc).toEqual([{ url: "#a", title: "A", depth: 2 }])
  })

  it("refuses MDX when raw HTML is not allowed", async () => {
    await expect(
      compileMarkdown({
        content: "x",
        filePath: "/a.mdx",
        format: "mdx",
        outputFormat: "program",
        options: { allowDangerousHtml: false },
      }),
    ).rejects.toThrow("allowDangerousHtml: false")
  })
})

describe("detectMarkdownFormat", () => {
  it("takes frontmatter `format` over the extension", () => {
    expect(detectMarkdownFormat({ filePath: "a.md" })).toBe("md")
    expect(detectMarkdownFormat({ filePath: "a.mdx" })).toBe("mdx")
    expect(detectMarkdownFormat({ filePath: "a.md", format: "mdx" })).toBe("mdx")
    expect(detectMarkdownFormat({ filePath: "a.mdx", format: "md" })).toBe("md")
    expect(detectMarkdownFormat({ filePath: "a.md", format: "html" })).toBe("md")
  })
})
