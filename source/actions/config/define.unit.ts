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

  it("should reject missing include", () => {
    expect(() => defineConfig({} as any)).toThrow()
  })
})
