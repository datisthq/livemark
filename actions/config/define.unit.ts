import { describe, expect, it } from "vite-plus/test"
import { defineConfig } from "./define.ts"

describe("defineConfig", () => {
  it("should accept include as a string", () => {
    const config = defineConfig({ articles: { include: "articles/**/*.mdx" } })
    expect(config.articles.include).toBe("articles/**/*.mdx")
  })

  it("should accept include as an array", () => {
    const config = defineConfig({
      articles: { include: ["articles/**/*.mdx", "guides/**/*.mdx"] },
    })
    expect(config.articles.include).toEqual([
      "articles/**/*.mdx",
      "guides/**/*.mdx",
    ])
  })

  it("should accept optional exclude", () => {
    const config = defineConfig({
      articles: { include: "**/*.mdx", exclude: "drafts/**" },
    })
    expect(config.articles.exclude).toBe("drafts/**")
  })

  it("should allow omitting exclude", () => {
    const config = defineConfig({ articles: { include: "**/*.mdx" } })
    expect(config.articles.exclude).toBeUndefined()
  })

  it("should reject missing articles", () => {
    expect(() => defineConfig({} as any)).toThrow()
  })

  it("should reject missing include", () => {
    expect(() => defineConfig({ articles: {} } as any)).toThrow()
  })
})
