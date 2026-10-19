import { existsSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { targetDirFor } from "./build.ts"
import { clearTarget } from "./clear.ts"

describe("clearTarget", () => {
  it("removes the target dir and tolerates a missing one", () =>
    temporaryDirectoryTask(async root => {
      const configPath = join(root, "livemark.config.ts")
      const targetDir = targetDirFor(configPath)
      await mkdir(join(targetDir, "cache"), { recursive: true })
      await writeFile(join(targetDir, "cache", "entry.md"), "cached")

      expect(clearTarget(configPath)).toBe(targetDir)
      expect(existsSync(targetDir)).toBe(false)
      expect(() => clearTarget(configPath)).not.toThrow()
    }))
})
