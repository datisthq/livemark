import { describe, expect, it } from "vite-plus/test"
import { resolveBase } from "./resolve-base.ts"

describe("resolveBase", () => {
  it("should return undefined for undefined input", () => {
    expect(resolveBase(undefined, "build")).toBeUndefined()
    expect(resolveBase(undefined, "serve")).toBeUndefined()
  })

  it("should return undefined for empty or root-only string", () => {
    expect(resolveBase("", "build")).toBeUndefined()
    expect(resolveBase("/", "build")).toBeUndefined()
  })

  it("should normalize a string without slashes", () => {
    expect(resolveBase("repo", "build")).toBe("/repo")
  })

  it("should normalize a string with leading slash", () => {
    expect(resolveBase("/repo", "build")).toBe("/repo")
  })

  it("should normalize a string with trailing slash", () => {
    expect(resolveBase("repo/", "build")).toBe("/repo")
  })

  it("should normalize a string with both slashes", () => {
    expect(resolveBase("/repo/", "build")).toBe("/repo")
  })

  it("should preserve multi-segment paths", () => {
    expect(resolveBase("/a/b/", "build")).toBe("/a/b")
  })

  it("should call a function with command=build", () => {
    const fn = (cmd: "build" | "serve") => (cmd === "build" ? "prod" : "dev")
    expect(resolveBase(fn, "build")).toBe("/prod")
  })

  it("should call a function with command=serve", () => {
    const fn = (cmd: "build" | "serve") => (cmd === "build" ? "prod" : "dev")
    expect(resolveBase(fn, "serve")).toBe("/dev")
  })

  it("should handle a function returning undefined", () => {
    const fn = (cmd: "build" | "serve") =>
      cmd === "serve" ? undefined : "prod"
    expect(resolveBase(fn, "serve")).toBeUndefined()
    expect(resolveBase(fn, "build")).toBe("/prod")
  })

  it("should handle a function returning empty string", () => {
    const fn = () => ""
    expect(resolveBase(fn, "build")).toBeUndefined()
  })

  it("should normalize the function-returned string", () => {
    const fn = () => "/repo/"
    expect(resolveBase(fn, "build")).toBe("/repo")
  })
})
