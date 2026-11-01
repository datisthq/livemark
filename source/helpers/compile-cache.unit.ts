import { writeFile } from "node:fs/promises"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it, vi } from "vite-plus/test"
import { createCompileCache } from "./compile-cache.ts"

describe("createCompileCache", () => {
  it("serves an entry from disk while the config and its imports stay the same", () =>
    temporaryDirectoryTask(async dir => {
      const plugin = join(dir, "plugin.ts")
      await writeFile(plugin, "export default 1")
      const config = { configDependencies: [plugin] }
      const compute = vi.fn(async () => "compiled")
      await createCompileCache({ dir: join(dir, "cache"), config }).read("a", compute)
      await createCompileCache({ dir: join(dir, "cache"), config }).read("a", compute)
      expect(compute).toHaveBeenCalledTimes(1)
    }))

  it("compiles again once a file the config imports changes, as a plugin does", () =>
    temporaryDirectoryTask(async dir => {
      const plugin = join(dir, "plugin.ts")
      await writeFile(plugin, "export default 1")
      const config = { configDependencies: [plugin] }
      const compute = vi.fn(async () => "compiled")
      await createCompileCache({ dir: join(dir, "cache"), config }).read("a", compute)
      await writeFile(plugin, "export default 2")
      await createCompileCache({ dir: join(dir, "cache"), config }).read("a", compute)
      expect(compute).toHaveBeenCalledTimes(2)
    }))
})
