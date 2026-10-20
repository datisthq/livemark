import fs from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { collectLocalImports } from "./local-imports.ts"

describe("collectLocalImports", () => {
  it("should follow relative imports transitively and skip packages", () =>
    temporaryDirectoryTask(tmpDir => {
      fs.mkdirSync(join(tmpDir, "lib"))
      fs.writeFileSync(
        join(tmpDir, "entry.ts"),
        'import { a } from "./lib/a.ts"\nimport { z } from "zod"\n',
      )
      fs.writeFileSync(
        join(tmpDir, "lib", "a.ts"),
        'import "../b.ts"\nexport const a = 1\n',
      )
      fs.writeFileSync(join(tmpDir, "b.ts"), 'export * from "./entry.ts"\n')
      expect(collectLocalImports(join(tmpDir, "entry.ts")).sort()).toEqual(
        [
          join(tmpDir, "b.ts"),
          join(tmpDir, "entry.ts"),
          join(tmpDir, "lib", "a.ts"),
        ].sort(),
      )
    }))

  it("should skip imports that do not resolve to a file", () =>
    temporaryDirectoryTask(tmpDir => {
      fs.writeFileSync(join(tmpDir, "entry.ts"), 'import "./missing.ts"\n')
      expect(collectLocalImports(join(tmpDir, "entry.ts"))).toEqual([
        join(tmpDir, "entry.ts"),
      ])
    }))
})
