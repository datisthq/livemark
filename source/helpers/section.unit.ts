import { describe, expect, it } from "vite-plus/test"
import {
  customSectionActive,
  matchSection,
  partitionBySection,
} from "./section.ts"

describe("matchSection", () => {
  const sections = [
    { title: "Docs", prefix: "/" },
    { title: "API", prefix: "/api/" },
    { title: "API Auth", prefix: "/api/auth/" },
  ]

  it("should match the most specific prefix", () => {
    expect(matchSection("/api/auth/login/", sections)?.title).toBe("API Auth")
  })

  it("should match a less specific prefix when no deeper match", () => {
    expect(matchSection("/api/users/", sections)?.title).toBe("API")
  })

  it("should match root section as fallback", () => {
    expect(matchSection("/getting-started/", sections)?.title).toBe("Docs")
  })

  it("should return undefined when no section matches", () => {
    const narrow = [{ title: "API", prefix: "/api/" }]
    expect(matchSection("/getting-started/", narrow)).toBeUndefined()
  })

  it("should match a single root section for all articles", () => {
    const root = [{ title: "Docs", prefix: "/" }]
    expect(matchSection("/anything/deep/path/", root)?.title).toBe("Docs")
  })
})

describe("partitionBySection", () => {
  const sections = [
    { title: "Docs", prefix: "/" },
    { title: "API", prefix: "/api/" },
  ]

  const articles = [
    { path: "/getting-started/" },
    { path: "/guide/" },
    { path: "/api/users/" },
    { path: "/api/auth/" },
  ]

  it("should split articles into section buckets", () => {
    const result = partitionBySection(articles, sections)
    expect(result.get("/")?.map(a => a.path)).toEqual([
      "/getting-started/",
      "/guide/",
    ])
    expect(result.get("/api/")?.map(a => a.path)).toEqual([
      "/api/users/",
      "/api/auth/",
    ])
  })

  it("should put unmatched articles in __default__ bucket", () => {
    const narrow = [{ title: "API", prefix: "/api/" }]
    const result = partitionBySection(articles, narrow)
    expect(result.get("__default__")?.map(a => a.path)).toEqual([
      "/getting-started/",
      "/guide/",
    ])
    expect(result.get("/api/")?.map(a => a.path)).toEqual([
      "/api/users/",
      "/api/auth/",
    ])
  })
})

describe("customSectionActive", () => {
  it("should not match an absolute http url", () => {
    expect(customSectionActive("https://x.com/y", "/y/")).toBe(false)
    expect(customSectionActive("http://x.com/y", "/y/")).toBe(false)
  })

  it("should not match a protocol-relative url", () => {
    expect(customSectionActive("//cdn.x.com/y", "/y/")).toBe(false)
  })

  it("should not match a hash url", () => {
    expect(customSectionActive("#section", "/section/")).toBe(false)
  })

  it("should match the exact path", () => {
    expect(customSectionActive("/about", "/about/")).toBe(true)
    expect(customSectionActive("/about/", "/about/")).toBe(true)
  })

  it("should match a descendant path", () => {
    expect(customSectionActive("/about", "/about/team/")).toBe(true)
  })

  it("should not match a sibling path with shared prefix", () => {
    expect(customSectionActive("/about", "/aboutus/")).toBe(false)
  })

  it("should match exact root only", () => {
    expect(customSectionActive("/", "/")).toBe(true)
    expect(customSectionActive("/", "/about/")).toBe(false)
  })

  it("should ignore query and hash on the url", () => {
    expect(customSectionActive("/about?x=1", "/about/")).toBe(true)
    expect(customSectionActive("/about#top", "/about/team/")).toBe(true)
  })
})
