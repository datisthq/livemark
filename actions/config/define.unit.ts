import { describe, expect, it } from "vite-plus/test"
import { defineConfig } from "./define.ts"

describe("defineConfig", () => {
  it("should accept include as a string", () => {
    const config = defineConfig({ docs: { include: "docs/**/*.mdx" } })
    expect(config.docs.include).toBe("docs/**/*.mdx")
  })

  it("should accept include as an array", () => {
    const config = defineConfig({
      docs: { include: ["docs/**/*.mdx", "guides/**/*.mdx"] },
    })
    expect(config.docs.include).toEqual(["docs/**/*.mdx", "guides/**/*.mdx"])
  })

  it("should accept optional exclude", () => {
    const config = defineConfig({
      docs: { include: "**/*.mdx", exclude: "drafts/**" },
    })
    expect(config.docs.exclude).toBe("drafts/**")
  })

  it("should allow omitting exclude", () => {
    const config = defineConfig({ docs: { include: "**/*.mdx" } })
    expect(config.docs.exclude).toBeUndefined()
  })

  it("should reject missing docs", () => {
    expect(() => defineConfig({} as any)).toThrow()
  })

  it("should reject missing include", () => {
    expect(() => defineConfig({ docs: {} } as any)).toThrow()
  })
})
