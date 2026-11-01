import { createElement } from "react"
import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import type { Element, Root as HtmlRoot } from "hast"
import type { Root as MdRoot } from "mdast"
import * as html from "textlane/html"
import { describe, expect, it } from "vite-plus/test"
import type { ArticlePlugins } from "../../models/config.ts"
import { Config } from "../../models/config.ts"
import { createMdxComponent } from "../../helpers/mdx-component.ts"
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

  it.each([
    [":::card\nx\n:::\n:::card\ny\n:::", ["Card", "Cards"]],
    [":::column\nx\n:::\n:::column\ny\n:::", ["Column", "Columns"]],
    [":::tab{title=A}\nx\n:::", ["Tab", "Tabs"]],
    [":::details\nx\n:::", ["Details"]],
    [":::filetree\n- a\n:::", ["Filetree"]],
    ["a :badge[x]", ["Badge"]],
    ["::button[Go]{href=/x}", ["Button"]],
    ["a :icon{name=star}", ["Icon"]],
    ["a :abbr[HTML]{title=x}", ["Abbr"]],
    ["::toc", ["Toc"]],
    ["::video{type=youtube url=x}", ["Video"]],
    ["::audio{type=soundcloud url=x}", ["Audio"]],
  ])("renders %j as the component named after its directive", async (content, names) => {
    const article = await compileFixture("page.md", content)
    for (const name of names) {
      expect(article.mdx).toMatch(new RegExp(String.raw`_jsxs?\(${name}, `))
    }
  })
})

describe("compileArticle with project plugins", () => {
  it("runs `md` plugins before components, so one can render its own directive", async () => {
    const article = await compileFixture("page.md", "::hello", undefined, {
      md: [replaceHelloDirective],
    })
    expect(article.mdx).toContain("Hello from a plugin")
    expect(article.mdx).not.toContain("::hello")
  })

  it("runs `html` plugins before slugs, so a heading they add reaches the outline", async () => {
    const article = await compileFixture("page.md", "Text", undefined, {
      html: [prependHeading],
    })
    expect(article.tocItems).toEqual([{ url: "#added", title: "Added", depth: 2 }])
  })

  it("runs a native textlane plugin", async () => {
    const page = await renderArticle("page.md", "[x](https://example.com)", undefined, {
      html: [html.externalLinks()],
    })
    expect(page).toContain(`<a href="https://example.com" rel="nofollow">`)
  })
})

// mdast leaves directive nodes to mdast-util-directive, which this package doesn't need
declare module "mdast" {
  interface RootContentMap {
    leafDirective: { type: "leafDirective"; name: string; children: PhrasingContent[] }
  }
}

function replaceHelloDirective() {
  return (tree: MdRoot) => {
    tree.children = tree.children.map(node =>
      node.type === "leafDirective" && node.name === "hello"
        ? {
            type: "paragraph",
            children: [{ type: "text", value: "Hello from a plugin" }],
          }
        : node,
    )
  }
}

function prependHeading() {
  return (tree: HtmlRoot) => {
    const heading: Element = {
      type: "element",
      tagName: "h2",
      properties: {},
      children: [{ type: "text", value: "Added" }],
    }
    tree.children.unshift(heading)
  }
}

async function renderArticle(
  filePath: string,
  content: string,
  format?: "md" | "mdx",
  plugins?: ArticlePlugins,
) {
  const article = await compileFixture(filePath, content, format, plugins)
  const Content = createMdxComponent(article.mdx)
  const Callout = (props: { type: string; children: ReactNode }) =>
    createElement("aside", { "data-type": props.type }, props.children)
  return renderToStaticMarkup(createElement(Content, { components: { Callout } }))
}

function compileFixture(
  filePath: string,
  content: string,
  format?: "md" | "mdx",
  plugins?: ArticlePlugins,
) {
  const config = {
    ...Config.parse({ root: ".", configPath: "livemark.config.ts", plugins }),
    base: undefined,
  }
  return compileArticle({ content, filePath, format, config })
}
