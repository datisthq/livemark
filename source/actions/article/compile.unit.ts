import { createElement } from "react"
import type { ComponentType, ReactNode } from "react"
import * as runtime from "react/jsx-runtime"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vite-plus/test"
import { Config } from "../../models/config.ts"
import { compileArticle } from "./compile.ts"

const CHANGELOG = [
  "- regex engines disagree on named groups, \\p{..} and (?i)",
  "- accept a {x} placeholder",
  "- pass <name> to the resource",
].join("\n")

describe("compileArticle", () => {
  it("compiles a .md file as plain Markdown: braces literal, tags as HTML", async () => {
    const html = await renderArticle("CHANGELOG.md", CHANGELOG)
    expect(html).toContain("\\p{..}")
    expect(html).toContain("a {x} placeholder")
    expect(html).toContain("<li>pass <name> to the resource</name></li>")
  })

  it("compiles a .mdx file as MDX, where the same text fails", async () => {
    await expect(renderArticle("CHANGELOG.mdx", CHANGELOG)).rejects.toThrow()
  })

  it("lets `format` override the file extension", async () => {
    await expect(renderArticle("CHANGELOG.md", CHANGELOG, "mdx")).rejects.toThrow()
    const html = await renderArticle("page.mdx", "a {1 + 1} b", "md")
    expect(html).toContain("a {1 + 1} b")
  })

  it("evaluates expressions and JSX in MDX", async () => {
    const html = await renderArticle("page.mdx", 'a {1 + 1} <span className="x">b</span>')
    expect(html).toBe('<p>a 2 <span class="x">b</span></p>')
  })

  it("parses raw HTML in Markdown", async () => {
    const html = await renderArticle("page.md", 'Press <kbd class="k">C</kbd>')
    expect(html).toBe('<p>Press <kbd class="k">C</kbd></p>')
  })

  it("returns the outline of h2 to h4", async () => {
    const article = await compileFixture(
      "page.md",
      "# T\n\n## A\n\n##### E\n\n### B {#b}",
    )
    expect(article.tocItems).toEqual([
      { url: "#a", title: "A", depth: 2 },
      { url: "#b", title: "B", depth: 3 },
    ])
  })

  it("renders directives and GFM in Markdown: a directive and a GFM table", async () => {
    const content = [":::tip", "Hello", ":::", "", "| a | b |", "| - | - |", "| 1 | 2 |"]
    const html = await renderArticle("page.md", content.join("\n"))
    expect(html).toContain('<aside data-type="tip"><p>Hello</p></aside>')
    expect(html).toContain("<table>")
    expect(html).toContain("<td>2</td>")
  })
})

async function renderArticle(filePath: string, content: string, format?: "md" | "mdx") {
  const article = await compileFixture(filePath, content, format)
  const scope: unknown = new Function("React", "ReactDOM", "_jsx_runtime", article.mdx)(
    undefined,
    undefined,
    runtime,
  )
  if (!isModule(scope)) throw new Error("the article exports no default component")
  const Callout = (props: { type: string; children: ReactNode }) =>
    createElement("aside", { "data-type": props.type }, props.children)
  return renderToStaticMarkup(createElement(scope.default, { components: { Callout } }))
}

function compileFixture(filePath: string, content: string, format?: "md" | "mdx") {
  const config = {
    ...Config.parse({ root: ".", configPath: "livemark.config.ts" }),
    base: undefined,
  }
  return compileArticle(
    { cache: async (input, compute) => compute(input) },
    { _meta: makeMeta(filePath), content },
    { format, config, filePath },
  )
}

function isModule(
  value: unknown,
): value is { default: ComponentType<{ components: object }> } {
  return typeof value === "object" && value !== null && "default" in value
}

function makeMeta(filePath: string) {
  const fileName = filePath.split("/").pop() ?? filePath
  const extension = fileName.split(".").pop() ?? ""
  const path = filePath.replace(/\.\w+$/, "")
  return { filePath, fileName, directory: ".", extension, path }
}
