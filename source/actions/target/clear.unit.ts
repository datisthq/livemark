import { existsSync } from "node:fs"
import { mkdir, symlink, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { cacheDirFor } from "../../helpers/target-dir.ts"
import { targetDirFor } from "./build.ts"
import { clearTarget } from "./clear.ts"

describe("clearTarget", () => {
  it("removes the target dirs without following their dependency link", () =>
    temporaryDirectoryTask(async root => {
      const configPath = join(root, "livemark.config.ts")
      const targetDir = targetDirFor(configPath)
      const buildDir = targetDirFor(configPath, "build")
      const cacheDir = cacheDirFor(configPath)
      await mkdir(buildDir, { recursive: true })
      await mkdir(cacheDir, { recursive: true })
      await mkdir(join(targetDir, "cache"), { recursive: true })
      await writeFile(join(targetDir, "cache", "entry.md"), "cached")
      await mkdir(join(root, "deps"))
      await writeFile(join(root, "deps", "kept.js"), "")
      await symlink(join(root, "deps"), join(targetDir, "node_modules"), "junction")

      expect(clearTarget(configPath)).toEqual([targetDir, buildDir, cacheDir])
      expect(existsSync(targetDir)).toBe(false)
      expect(existsSync(buildDir)).toBe(false)
      expect(existsSync(cacheDir)).toBe(false)
      expect(existsSync(join(root, "deps", "kept.js"))).toBe(true)
      expect(() => clearTarget(configPath)).not.toThrow()
    }))
})
