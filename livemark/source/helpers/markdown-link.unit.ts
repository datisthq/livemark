import { describe, expect, it } from "vite-plus/test"
import { resolveMarkdownLink } from "./markdown-link.ts"

const ARTICLES = [
  { file: "docs/intro.md", key: "/intro/", language: "en", path: "/intro/" },
  { file: "docs/intro.es.md", key: "/intro/", language: "es", path: "/es/intro/" },
  { file: "docs/guides/deploy.md", key: "/ship/", language: "en", path: "/ship/" },
  { file: "docs/a b.mdx", key: "/a-b/", language: "en", path: "/a-b/" },
]

function resolve(href: string, file = "docs/usage.md", language = "en") {
  return resolveMarkdownLink({ href, file, language, articles: ARTICLES })
}

describe("resolveMarkdownLink", () => {
  it("points a relative link to a Markdown file at its article", () => {
    expect(resolve("./intro.md")).toBe("/intro/")
    expect(resolve("intro.md")).toBe("/intro/")
    expect(resolve("guides/deploy.md")).toBe("/ship/")
    expect(resolve("../intro.md", "docs/guides/deploy.md")).toBe("/intro/")
  })

  it("keeps the fragment and decodes the file name", () => {
    expect(resolve("./intro.md#setup")).toBe("/intro/#setup")
    expect(resolve("./a%20b.mdx")).toBe("/a-b/")
  })

  it("takes the translation in the reader's language", () => {
    expect(resolve("./intro.md", "docs/usage.es.md", "es")).toBe("/es/intro/")
    expect(resolve("./guides/deploy.md", "docs/usage.es.md", "es")).toBe("/ship/")
  })

  it("leaves other links alone", () => {
    expect(resolve("./missing.md")).toBeUndefined()
    expect(resolve("/intro/")).toBeUndefined()
    expect(resolve("https://example.com/intro.md")).toBeUndefined()
    expect(resolve("#intro.md")).toBeUndefined()
    expect(resolve("./notes.txt")).toBeUndefined()
  })
})
