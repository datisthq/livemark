import { describe, expect, it } from "vite-plus/test"
import { isGitHubUrl, parseGitHubRepo } from "./changelog-source.ts"

describe("isGitHubUrl", () => {
  it("recognizes https github URLs", () => {
    expect(isGitHubUrl("https://github.com/foo/bar")).toBe(true)
  })

  it("recognizes bare github.com URLs", () => {
    expect(isGitHubUrl("github.com/foo/bar")).toBe(true)
  })

  it("rejects local paths", () => {
    expect(isGitHubUrl("CHANGELOG.md")).toBe(false)
    expect(isGitHubUrl("./CHANGELOG.md")).toBe(false)
    expect(isGitHubUrl("docs/CHANGELOG.md")).toBe(false)
  })
})

describe("parseGitHubRepo", () => {
  it("extracts owner and repo from https URL", () => {
    expect(parseGitHubRepo("https://github.com/datisthq/livemark")).toEqual({
      owner: "datisthq",
      repo: "livemark",
    })
  })

  it("strips .git suffix", () => {
    expect(parseGitHubRepo("https://github.com/foo/bar.git")).toEqual({
      owner: "foo",
      repo: "bar",
    })
  })

  it("returns undefined for non-github input", () => {
    expect(parseGitHubRepo("CHANGELOG.md")).toBeUndefined()
  })
})
