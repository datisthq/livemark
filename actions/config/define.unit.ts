import { describe, expect, it } from "vite-plus/test"
import { defineConfig } from "./define.ts"

describe("defineConfig", () => {
  it("should accept valid config with docs folders", () => {
    const config = defineConfig({ docs: { folders: ["docs"] } })
    expect(config.docs.folders).toEqual(["docs"])
  })

  it("should accept multiple folders", () => {
    const config = defineConfig({ docs: { folders: ["docs", "guides"] } })
    expect(config.docs.folders).toEqual(["docs", "guides"])
  })

  it("should reject missing docs", () => {
    expect(() => defineConfig({} as any)).toThrow()
  })

  it("should reject invalid folders type", () => {
    expect(() => defineConfig({ docs: { folders: "docs" } } as any)).toThrow()
  })
})
