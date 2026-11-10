import { describe, expect, it } from "vite-plus/test"
import { defineConfig } from "./define.ts"

describe("defineConfig", () => {
  it("should accept include as a string", () => {
    const config = defineConfig({ include: "articles/**/*.mdx" })
    expect(config.include).toBe("articles/**/*.mdx")
  })

  it("should accept include as an array", () => {
    const config = defineConfig({
      include: ["articles/**/*.mdx", "guides/**/*.mdx"],
    })
    expect(config.include).toEqual(["articles/**/*.mdx", "guides/**/*.mdx"])
  })

  it("should accept optional exclude", () => {
    const config = defineConfig({
      include: "**/*.mdx",
      exclude: "drafts/**",
    })
    expect(config.exclude).toBe("drafts/**")
  })

  it("should allow omitting exclude", () => {
    const config = defineConfig({ include: "**/*.mdx" })
    expect(config.exclude).toBeUndefined()
  })

  it("should default include to **/*.md", () => {
    const config = defineConfig({})
    expect(config.include).toBe("**/*.md")
  })

  it("should accept an inline Markdown banner", () => {
    const config = defineConfig({ banner: "Hi · [x](/y/)" })
    expect(config.banner).toBe("Hi · [x](/y/)")
  })

  it("should leave banner unset by default", () => {
    expect(defineConfig({}).banner).toBeUndefined()
  })

  it("should reject an unknown top-level key", () => {
    // @ts-expect-error a misspelled `title`
    expect(() => defineConfig({ tilte: "Docs" })).toThrow(/tilte/)
  })

  it("should reject unknown keys in sections, links and languages", () => {
    const section = { title: "Docs", prefix: "/", typo: true }
    const link = { url: "https://x.dev", title: "X", typo: true }
    const language = { code: "en", label: "English", typo: true }
    expect(() => defineConfig({ sections: [section] })).toThrow(/typo/)
    expect(() => defineConfig({ links: [link] })).toThrow(/typo/)
    expect(() => defineConfig({ languages: [language] })).toThrow(/typo/)
  })
})
