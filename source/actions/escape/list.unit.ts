import fs from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { listEscapes } from "./list.ts"

describe("listEscapes", () => {
  it("should list folder files and top-level files, sorted", () =>
    temporaryDirectoryTask(async tmpDir => {
      const sourceRoot = join(tmpDir, "source")
      writeFile(join(sourceRoot, "components", "Footer.tsx"))
      writeFile(join(sourceRoot, "styles", "general.css"))
      writeFile(join(sourceRoot, "client.tsx"))
      writeFile(join(sourceRoot, "index.ts"))
      fs.mkdirSync(join(sourceRoot, "elements", "nested"), { recursive: true })

      const escapes = listEscapes({ root: tmpDir, sourceRoot })
      expect(escapes.map(escape => escape.path)).toEqual([
        "client.tsx",
        "components/Footer.tsx",
        "styles/general.css",
      ])
    }))

  it("should mark files the project already shadows", () =>
    temporaryDirectoryTask(async tmpDir => {
      const sourceRoot = join(tmpDir, "source")
      writeFile(join(sourceRoot, "components", "Footer.tsx"))
      writeFile(join(sourceRoot, "components", "Header.tsx"))
      writeFile(join(tmpDir, ".livemark", "components", "Footer.tsx"))

      expect(listEscapes({ root: tmpDir, sourceRoot })).toEqual([
        { path: "components/Footer.tsx", escaped: true },
        { path: "components/Header.tsx", escaped: false },
      ])
    }))
})

function writeFile(path: string) {
  fs.mkdirSync(join(path, ".."), { recursive: true })
  fs.writeFileSync(path, "default\n")
}
