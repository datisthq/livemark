import { realpathSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { resolveDependencyDir } from "./dependency-dir.ts"

describe("resolveDependencyDir", () => {
  it("uses the store dir beside an isolated install", () =>
    temporaryDirectoryTask(async root => {
      const store = join(root, ".pnpm/livemark@1.0.0/node_modules")
      await mkdir(join(store, "livemark/source"), { recursive: true })
      await mkdir(join(store, "livemark/node_modules/.bin"), { recursive: true })

      expect(resolveDependencyDir(join(store, "livemark/source"))).toBe(
        realpathSync(store),
      )
    }))

  it("uses the package's own node_modules when it has one", () =>
    temporaryDirectoryTask(async root => {
      const packageDir = join(root, "node_modules/livemark")
      await mkdir(join(packageDir, "source"), { recursive: true })
      await mkdir(join(packageDir, "node_modules/zod"), { recursive: true })

      expect(resolveDependencyDir(join(packageDir, "source"))).toBe(
        join(realpathSync(packageDir), "node_modules"),
      )
    }))

  it("uses the checkout's node_modules outside an install", () =>
    temporaryDirectoryTask(async root => {
      await mkdir(join(root, "livemark/source"), { recursive: true })

      expect(resolveDependencyDir(join(root, "livemark/source"))).toBe(
        join(realpathSync(root), "livemark/node_modules"),
      )
    }))
})
