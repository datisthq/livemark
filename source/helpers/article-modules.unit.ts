import { describe, expect, it } from "vite-plus/test"
import {
  assertUniquePaths,
  renderArticlesModule,
  renderBodyModule,
  renderSearchModule,
} from "./article-modules.ts"

const articles = [
  {
    path: "/guide/",
    language: "en",
    title: "Guide",
    mdx: "code",
    content: "# Guide",
    tocItems: [],
    searchText: "guide text",
  },
  { path: "/es/guide/", language: "es", title: "Guía", searchText: "texto" },
]

describe("assertUniquePaths", () => {
  it("accepts distinct paths", () => {
    expect(() => assertUniquePaths(articles)).not.toThrow()
  })

  it("rejects two articles at one path, naming both files", () => {
    const read = () =>
      assertUniquePaths([
        { path: "/a/", language: "en", file: "docs/a1.md" },
        { path: "/a/", language: "en", file: "docs/a2.md" },
      ])
    expect(read).toThrow('docs/a1.md and docs/a2.md share the path "/a/"')
  })
})

describe("renderArticlesModule", () => {
  const source = renderArticlesModule(articles)

  it("lists articles without bodies or search text", () => {
    expect(source).toContain('"title":"Guide"')
    expect(source).not.toContain('"mdx"')
    expect(source).not.toContain("guide text")
  })

  it("loads each body and each language's search text on demand", () => {
    expect(source).toContain('"/guide/": () => import("livemark:article/%2Fguide%2F")')
    expect(source).toContain('"es": () => import("livemark:search/es")')
  })
})

describe("renderBodyModule", () => {
  it("serves one article's body", () => {
    expect(renderBodyModule(articles, "%2Fguide%2F")).toBe(
      'export default {"mdx":"code","content":"# Guide","tocItems":[]}',
    )
  })
})

describe("renderSearchModule", () => {
  it("serves one language's search text", () => {
    expect(renderSearchModule(articles, "es")).toBe(
      'export default [{"path":"/es/guide/","searchText":"texto"}]',
    )
  })
})
