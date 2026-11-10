import { readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vite-plus/test"
import { readSourceRoots } from "./source-roots.ts"

const LIVEMARK = join(import.meta.dirname, "..", "..")
const [MARKDOWN_SOURCE = "", LIVEMARK_SOURCE = ""] = readSourceRoots(
  join(LIVEMARK, "source"),
)

describe("readSourceRoots", () => {
  it("lays @livemark/markdown's source beneath livemark's", () => {
    expect(relative(LIVEMARK, LIVEMARK_SOURCE)).toBe("source")
    expect(readdirSync(MARKDOWN_SOURCE)).toContain("components")
  })

  it("finds no path in both trees, which would shadow one silently", () => {
    const livemark = new Set(listFiles(LIVEMARK_SOURCE))
    expect(listFiles(MARKDOWN_SOURCE).filter(file => livemark.has(file))).toEqual([])
  })

  it("declares every dependency of @livemark/markdown in livemark at the same version", () => {
    // A site's target resolves packages from livemark's dependencies alone
    const read = (dir: string) =>
      JSON.parse(readFileSync(join(dir, "package.json"), "utf8"))
    const markdown = read(join(MARKDOWN_SOURCE, ".."))
    const livemark = read(LIVEMARK)
    for (const [name, version] of Object.entries(markdown.dependencies)) {
      expect(`${name}@${livemark.dependencies[name]}`).toBe(`${name}@${version}`)
    }
  })
})

function listFiles(dir: string) {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter(file => /\.(tsx?|css)$/.test(file) && !/\.unit\.ts$|fixtures/.test(file))
    .map(file => file.split("\\").join("/"))
}
