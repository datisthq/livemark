import { describe, expect, it } from "vite-plus/test"
import {
  readGeneratedArticles,
  renderArticlesModule,
  renderBodyModule,
  renderSearchModule,
} from "./article-modules.ts"

const articles = readGeneratedArticles([
  {
    path: "/guide/",
    language: "en",
    title: "Guide",
    mdx: "code",
    content: "# Guide",
    tocItems: [],
    searchText: "guide text",
    _meta: { filePath: "guide.md" },
  },
  { path: "/es/guide/", language: "es", title: "Guía", searchText: "texto" },
  { title: "no path" },
])

describe("readGeneratedArticles", () => {
  it("keeps entries with a path and a language", () => {
    expect(articles.map(a => a.path)).toEqual(["/guide/", "/es/guide/"])
  })
})

describe("renderArticlesModule", () => {
  const source = renderArticlesModule(articles)

  it("lists articles without bodies or search text", () => {
    expect(source).toContain('"title":"Guide"')
    expect(source).not.toContain('"mdx"')
    expect(source).not.toContain("guide text")
    expect(source).not.toContain("_meta")
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
