import { describe, expect, it } from "vite-plus/test"
import type { Section } from "../models/section.ts"
import {
  activeSiteLink,
  activeSiteSection,
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

describe("activeSiteSection", () => {
  const docs: Section = {
    type: "article",
    title: "Docs",
    prefix: "/",
    position: "header",
  }
  const blog: Section = {
    type: "blog",
    title: "Blog",
    prefix: "/blog/",
    position: "header",
  }
  const apiCustom: Section = {
    type: "custom",
    title: "API",
    url: "/api/v2",
    position: "header",
  }
  const githubCustom: Section = {
    type: "custom",
    title: "GitHub",
    url: "https://github.com/example/repo",
    position: "header",
  }
  const homeCustom: Section = {
    type: "custom",
    title: "Home",
    url: "/",
    position: "header",
  }

  it("should return the routed section matching by prefix", () => {
    expect(activeSiteSection("/blog/post/", [docs, blog])?.title).toBe("Blog")
  })

  it("should return the custom section matching by internal url", () => {
    expect(activeSiteSection("/api/v2/users/", [docs, apiCustom])?.title).toBe(
      "API",
    )
  })

  it("should pick the longest match among overlapping prefixes", () => {
    expect(activeSiteSection("/blog/post/", [docs, blog])?.title).toBe("Blog")
    expect(activeSiteSection("/api/v2/foo/", [docs, apiCustom])?.title).toBe(
      "API",
    )
  })

  it("should ignore custom sections with absolute URLs", () => {
    expect(activeSiteSection("/anything/", [githubCustom])).toBeUndefined()
  })

  it("should match custom URL `/` only on the home page", () => {
    expect(activeSiteSection("/", [homeCustom])?.title).toBe("Home")
    expect(activeSiteSection("/about/", [homeCustom])).toBeUndefined()
  })

  it("should let routed `/` match descendants while custom `/` does not", () => {
    expect(activeSiteSection("/about/", [docs, homeCustom])?.title).toBe("Docs")
  })

  it("should return undefined when no section matches", () => {
    expect(activeSiteSection("/anything/", [blog, apiCustom])).toBeUndefined()
  })
})

describe("activeSiteLink", () => {
  const docs: Section = {
    type: "article",
    title: "Docs",
    prefix: "/",
    position: "header",
  }
  const blog: Section = {
    type: "blog",
    title: "Blog",
    prefix: "/blog/",
    position: "header",
    siteLink: "/blog/",
  }
  const externalCustom: Section = {
    type: "custom",
    title: "GitHub",
    url: "/github",
    position: "header",
    siteLink: "https://github.com/example/repo",
  }

  it("should default to '/' when no section matches", () => {
    expect(activeSiteLink("/anything/", [blog])).toBe("/")
  })

  it("should default to '/' when matching section has no siteLink", () => {
    expect(activeSiteLink("/about/", [docs])).toBe("/")
  })

  it("should return the matching section's siteLink", () => {
    expect(activeSiteLink("/blog/post/", [blog])).toBe("/blog/")
  })

  it("should support absolute URLs as the siteLink", () => {
    expect(activeSiteLink("/github/", [externalCustom])).toBe(
      "https://github.com/example/repo",
    )
  })
})
