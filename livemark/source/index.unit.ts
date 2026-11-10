import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vite-plus/test"
import packageJson from "../package.json" with { type: "json" }

const ROOT = join(import.meta.dirname, "..")

describe("consumer types", () => {
  it("load livemark:virtual through the public entry", () => {
    const index = readFileSync(join(ROOT, "source/index.ts"), "utf8")
    expect(index).toContain('/// <reference types="livemark/env" preserve="true" />')
  })

  it("export the ambient declarations", () => {
    expect(packageJson.exports["./env"]).toBe("./source/env.d.ts")
    expect(existsSync(join(ROOT, packageJson.exports["./env"]))).toBe(true)
  })
})
