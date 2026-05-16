import { describe, expect, it } from "vite-plus/test"
import { renderRobots } from "./vite-robots.ts"

describe("renderRobots", () => {
  it("emits an allow-all body when site is not set", () => {
    expect(renderRobots({})).toBe("User-agent: *\nAllow: /\n")
  })

  it("appends a Sitemap line when site is set", () => {
    expect(renderRobots({ site: "https://livemark.dev" })).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://livemark.dev/sitemap.xml\n",
    )
  })

  it("strips a trailing slash from site before composing the URL", () => {
    expect(renderRobots({ site: "https://livemark.dev/" })).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://livemark.dev/sitemap.xml\n",
    )
  })

  it("includes the base path so the URL matches the build mount", () => {
    expect(
      renderRobots({ site: "https://user.github.io", base: "/repo" }),
    ).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://user.github.io/repo/sitemap.xml\n",
    )
  })

  it("ignores base when site is not set", () => {
    expect(renderRobots({ base: "/repo" })).toBe("User-agent: *\nAllow: /\n")
  })
})
