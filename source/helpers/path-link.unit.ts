import { describe, expect, it } from "vite-plus/test"
import { buildPathLink } from "./path-link.ts"

describe("buildPathLink", () => {
  it("should target the splat route with the slashes trimmed", () => {
    expect(buildPathLink("/docs/intro/")).toEqual({
      to: "/$",
      params: { _splat: "docs/intro" },
    })
  })

  it("should accept a path without slashes", () => {
    expect(buildPathLink("docs")).toEqual({ to: "/$", params: { _splat: "docs" } })
  })

  it("should target the index route for the root", () => {
    expect(buildPathLink("/")).toEqual({ to: "/", params: {} })
    expect(buildPathLink("//")).toEqual({ to: "/", params: {} })
    expect(buildPathLink("")).toEqual({ to: "/", params: {} })
  })
})
