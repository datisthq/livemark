import { describe, expect, it } from "vite-plus/test"
import { matchSection, partitionBySection } from "./section.ts"

describe("matchSection", () => {
  const sections = [
    { title: "Docs", pathname: "/" },
    { title: "API", pathname: "/api/" },
    { title: "API Auth", pathname: "/api/auth/" },
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
    const narrow = [{ title: "API", pathname: "/api/" }]
    expect(matchSection("/getting-started/", narrow)).toBeUndefined()
  })

  it("should match a single root section for all articles", () => {
    const root = [{ title: "Docs", pathname: "/" }]
    expect(matchSection("/anything/deep/path/", root)?.title).toBe("Docs")
  })
})

describe("partitionBySection", () => {
  const sections = [
    { title: "Docs", pathname: "/" },
    { title: "API", pathname: "/api/" },
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
    const narrow = [{ title: "API", pathname: "/api/" }]
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
