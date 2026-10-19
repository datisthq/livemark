import fs from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { copyEscape } from "./copy.ts"

describe("copyEscape", () => {
  it("should copy a default into .livemark/", () =>
    temporaryDirectoryTask(async tmpDir => {
      const sourceRoot = createSource(tmpDir)
      const dest = copyEscape({ root: tmpDir, sourceRoot, path: "components/Footer.tsx" })
      expect(dest).toBe(join(tmpDir, ".livemark", "components", "Footer.tsx"))
      expect(fs.readFileSync(dest, "utf8")).toBe("default\n")
    }))

  it("should refuse to overwrite an existing override", () =>
    temporaryDirectoryTask(async tmpDir => {
      const sourceRoot = createSource(tmpDir)
      copyEscape({ root: tmpDir, sourceRoot, path: "client.tsx" })
      expect(() => copyEscape({ root: tmpDir, sourceRoot, path: "client.tsx" })).toThrow(
        /already exists/,
      )
    }))

  it("should reject paths outside the escape contract", () =>
    temporaryDirectoryTask(async tmpDir => {
      const sourceRoot = createSource(tmpDir)
      for (const path of ["index.ts", "components/../index.ts", "helpers/toc.ts"]) {
        expect(() => copyEscape({ root: tmpDir, sourceRoot, path })).toThrow(
          /not escapable/,
        )
      }
    }))

  it("should reject an escapable path with no livemark file", () =>
    temporaryDirectoryTask(async tmpDir => {
      const sourceRoot = createSource(tmpDir)
      expect(() =>
        copyEscape({ root: tmpDir, sourceRoot, path: "components/Missing.tsx" }),
      ).toThrow(/not a livemark file/)
    }))
})

function createSource(tmpDir: string) {
  const sourceRoot = join(tmpDir, "source")
  fs.mkdirSync(join(sourceRoot, "components"), { recursive: true })
  fs.writeFileSync(join(sourceRoot, "components", "Footer.tsx"), "default\n")
  fs.writeFileSync(join(sourceRoot, "client.tsx"), "default\n")
  fs.writeFileSync(join(sourceRoot, "index.ts"), "default\n")
  return sourceRoot
}
