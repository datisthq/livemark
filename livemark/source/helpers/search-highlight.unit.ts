import { describe, expect, it } from "vite-plus/test"
import { buildHighlightPattern, findTextMatches } from "./search-highlight.ts"

describe("buildHighlightPattern", () => {
  it("should return undefined for an empty query", () => {
    expect(buildHighlightPattern("   ")).toBeUndefined()
  })

  it("should drop single-character words", () => {
    expect(buildHighlightPattern("a b")).toBeUndefined()
    expect(buildHighlightPattern("a config")?.source).toBe("config")
  })

  it("should put longer words first and dedupe case-insensitively", () => {
    expect(buildHighlightPattern("Side sidebar side")?.source).toBe("sidebar|side")
  })

  it("should escape regex syntax", () => {
    expect(buildHighlightPattern("c++ (x)")?.source).toBe("c\\+\\+|\\(x\\)")
  })
})

describe("findTextMatches", () => {
  it("should find every word case-insensitively", () => {
    const pattern = buildHighlightPattern("search config")
    expect(pattern && findTextMatches("Search the Config, search!", pattern)).toEqual([
      [0, 6],
      [11, 17],
      [19, 25],
    ])
  })

  it("should prefer the longest word at a shared position", () => {
    const pattern = buildHighlightPattern("side sidebar")
    expect(pattern && findTextMatches("the sidebar", pattern)).toEqual([[4, 11]])
  })

  it("should return no matches when nothing matches", () => {
    const pattern = buildHighlightPattern("orama")
    expect(pattern && findTextMatches("nothing here", pattern)).toEqual([])
  })
})
