import { describe, expect, it } from "vite-plus/test"
import { prefixUrl } from "./prefix-url.ts"

describe("prefixUrl", () => {
  it("should return url unchanged when base is undefined", () => {
    expect(prefixUrl("/foo", undefined)).toBe("/foo")
  })

  it("should prefix a root-relative url", () => {
    expect(prefixUrl("/foo", "/repo")).toBe("/repo/foo")
  })

  it("should prefix a deep root-relative url", () => {
    expect(prefixUrl("/a/b/c.png", "/repo")).toBe("/repo/a/b/c.png")
  })

  it("should leave protocol-absolute http urls untouched", () => {
    expect(prefixUrl("http://x.com/y", "/repo")).toBe("http://x.com/y")
    expect(prefixUrl("https://x.com/y", "/repo")).toBe("https://x.com/y")
  })

  it("should leave protocol-relative urls untouched", () => {
    expect(prefixUrl("//cdn.x.com/y", "/repo")).toBe("//cdn.x.com/y")
  })

  it("should leave scheme urls untouched", () => {
    expect(prefixUrl("mailto:a@b.com", "/repo")).toBe("mailto:a@b.com")
    expect(prefixUrl("tel:+123", "/repo")).toBe("tel:+123")
    expect(prefixUrl("data:image/png;base64,xyz", "/repo")).toBe(
      "data:image/png;base64,xyz",
    )
  })

  it("should leave hash urls untouched", () => {
    expect(prefixUrl("#section", "/repo")).toBe("#section")
  })

  it("should leave document-relative urls untouched", () => {
    expect(prefixUrl("foo.png", "/repo")).toBe("foo.png")
    expect(prefixUrl("./foo.png", "/repo")).toBe("./foo.png")
    expect(prefixUrl("../foo.png", "/repo")).toBe("../foo.png")
  })

  it("should be idempotent on already-prefixed urls", () => {
    expect(prefixUrl("/repo/foo", "/repo")).toBe("/repo/foo")
    expect(prefixUrl("/repo", "/repo")).toBe("/repo")
  })

  it("should not match prefix-as-substring", () => {
    expect(prefixUrl("/repository/foo", "/repo")).toBe("/repo/repository/foo")
  })

  it("should support multi-segment base", () => {
    expect(prefixUrl("/foo", "/a/b")).toBe("/a/b/foo")
    expect(prefixUrl("/a/b/foo", "/a/b")).toBe("/a/b/foo")
  })
})
