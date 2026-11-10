import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vite-plus/test"
import { ArrowRight } from "lucide-react"
import { importMarkdown, transformMarkdown } from "./fixtures/import-markdown.ts"
import { IconsProvider, MessagesProvider } from "./react.ts"

describe("markdown", () => {
  it("emits a module that renders with Livemark's components by itself", async () => {
    const source = "---\ntitle: Post\n---\n\n## Intro\n\n:::note\nCareful\n:::"
    const post = await importMarkdown({ source })
    expect(post.code).not.toContain("new Function")
    expect(post.frontmatter).toEqual({ title: "Post" })
    expect(post.toc).toEqual([{ url: "#intro", title: "Intro", depth: 2 }])
    const html = renderToStaticMarkup(createElement(post.default))
    expect(html).toContain("Careful")
    expect(html).toContain("Note")
  })

  it("lets components be replaced per use", async () => {
    const post = await importMarkdown({ source: "[x](/a)" })
    const a = (props: { href?: string }) => createElement("b", null, props.href)
    const html = renderToStaticMarkup(createElement(post.default, { components: { a } }))
    expect(html).toContain("<b>/a</b>")
  })

  it("compiles .mdx and frontmatter `format: mdx` as MDX, .md as Markdown", async () => {
    const render = async (name: string, source: string) =>
      renderToStaticMarkup(
        createElement((await importMarkdown({ name, source })).default),
      )
    expect(await render("a.mdx", "a {1 + 1} b")).toContain("a 2 b")
    expect(await render("a.md", "---\nformat: mdx\n---\na {1 + 1} b")).toContain("a 2 b")
    expect(await render("a.md", "a {1 + 1} b")).toContain("a {1 + 1} b")
  })

  it("keeps raw HTML by default, as Livemark does", async () => {
    const post = await importMarkdown({ source: 'Press <kbd class="k">C</kbd>' })
    expect(renderToStaticMarkup(createElement(post.default))).toContain(
      '<kbd class="k">C</kbd>',
    )
  })

  it("drops all raw HTML without allowDangerousHtml", async () => {
    const source = [
      "<script>alert(1)</script>",
      "",
      '<div onclick="alert(2)">block</div>',
      "",
      'Inline <img src="x" onerror="alert(3)"> <b>bold</b> text',
      "",
      "[x](javascript:alert(4))",
    ].join("\n")
    const post = await importMarkdown({ source, options: { allowDangerousHtml: false } })
    const html = renderToStaticMarkup(createElement(post.default))
    expect(html).not.toMatch(/<script|<div|<img|<b>|onclick|onerror|alert/)
    expect(html).toContain("Inline")
  })

  it("refuses MDX without allowDangerousHtml, by extension or frontmatter", async () => {
    const options = { allowDangerousHtml: false }
    await expect(
      transformMarkdown({ name: "a.mdx", source: "x", options }),
    ).rejects.toThrow(/MDX/)
    await expect(
      transformMarkdown({ source: "---\nformat: mdx\n---\nx", options }),
    ).rejects.toThrow(/MDX/)
  })

  it("never runs code in Markdown: imports and expressions stay text", async () => {
    const source = 'import fs from "node:fs"\n\na {globalThis.pwned = 1} b'
    const post = await importMarkdown({ source })
    expect(post.code).not.toContain('from "node:fs"')
    const html = renderToStaticMarkup(createElement(post.default))
    expect(html).toContain("{globalThis.pwned = 1}")
    expect(Reflect.get(globalThis, "pwned")).toBeUndefined()
  })

  it("warns about what renders silently wrong", async () => {
    const result = await transformMarkdown({ source: ":::nope\nx\n:::" })
    expect(result.warnings).toEqual([
      '/posts/post.md: line 1: unknown directive ":::nope" renders as text',
    ])
  })

  it("renders callouts, tabs, code and icons with the provided strings", async () => {
    const source = [
      ":::note",
      "Careful",
      ":::",
      "",
      "::::tab{title=One}",
      "First",
      "::::",
      "",
      "```ts",
      "const a = 1",
      "```",
      "",
      'Go :icon{name="arrow-right"}',
    ].join("\n")
    const Post = (await importMarkdown({ source })).default
    const html = renderToStaticMarkup(
      createElement(
        MessagesProvider,
        { messages: { "callout.note": "Nota" } },
        createElement(IconsProvider, { icons: { ArrowRight } }, createElement(Post)),
      ),
    )
    expect(html).toContain("Nota")
    expect(html).toContain("Careful")
    expect(html).toContain("One")
    expect(html).toContain("lucide-arrow-right")
    expect(html).toMatch(/<pre[^>]*shiki/)
  })

  it("falls back to English strings without a provider", async () => {
    const Post = (await importMarkdown({ source: ":::tip\nHi\n:::" })).default
    const html = renderToStaticMarkup(createElement(Post))
    expect(html).toContain("Tip")
  })
})
