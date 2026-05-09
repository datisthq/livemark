import { describe, expect, it } from "vite-plus/test"
import { resolveAssetPath } from "./resolve-asset-path.ts"

describe("resolveAssetPath", () => {
  const root = "/site"
  const filePath = "/site/docs/page.md"

  it("should resolve a sibling relative path", () => {
    expect(resolveAssetPath("./logo.png", filePath, root)).toBe(
      "/docs/logo.png",
    )
  })

  it("should resolve a parent relative path", () => {
    expect(resolveAssetPath("../assets/x.png", filePath, root)).toBe(
      "/assets/x.png",
    )
  })

  it("should pass through a root-relative url", () => {
    expect(resolveAssetPath("/foo.png", filePath, root)).toBe("/foo.png")
  })

  it("should pass through an http url", () => {
    expect(resolveAssetPath("https://x.com/y.png", filePath, root)).toBe(
      "https://x.com/y.png",
    )
  })

  it("should pass through a data url", () => {
    expect(resolveAssetPath("data:image/png;base64,xyz", filePath, root)).toBe(
      "data:image/png;base64,xyz",
    )
  })

  it("should prefix a resolved relative path with base", () => {
    expect(resolveAssetPath("./logo.png", filePath, root, "/repo")).toBe(
      "/repo/docs/logo.png",
    )
  })

  it("should prefix a root-relative url with base", () => {
    expect(resolveAssetPath("/foo.png", filePath, root, "/repo")).toBe(
      "/repo/foo.png",
    )
  })

  it("should not double-prefix an already-prefixed url", () => {
    expect(resolveAssetPath("/repo/foo.png", filePath, root, "/repo")).toBe(
      "/repo/foo.png",
    )
  })

  it("should not prefix external urls when base is set", () => {
    expect(
      resolveAssetPath("https://x.com/y.png", filePath, root, "/repo"),
    ).toBe("https://x.com/y.png")
  })
})
