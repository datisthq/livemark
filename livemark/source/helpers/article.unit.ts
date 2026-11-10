import { describe, expect, it } from "vite-plus/test"
import { buildArticleTree, flattenArticleTree } from "./article.ts"

describe("buildArticleTree", () => {
  it("nests by path when no key is given", () => {
    const tree = buildArticleTree([
      { path: "/guide/", title: "Guide" },
      { path: "/guide/install/", title: "Install" },
    ])
    expect(flattenArticleTree(tree)).toEqual(["/guide/", "/guide/install/"])
    expect(tree[0]?.children[0]?.path).toBe("/guide/install/")
  })

  it("nests an untranslated article under its translated parent by key", () => {
    const tree = buildArticleTree([
      { path: "/es/guide/", key: "/guide/", title: "Guía" },
      {
        path: "/guide/install/",
        key: "/guide/install/",
        title: "Install",
        untranslated: true,
      },
    ])
    expect(tree).toHaveLength(1)
    expect(tree[0]?.children[0]).toMatchObject({
      path: "/guide/install/",
      untranslated: true,
    })
  })
})
