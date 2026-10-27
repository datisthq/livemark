import { existsSync, readFileSync, readlinkSync, realpathSync } from "node:fs"
import { mkdir, rm, symlink, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { buildTarget, targetDirFor } from "./build.ts"

describe("buildTarget", () => {
  it("copies the source, overlays escapes and skips unit tests", () =>
    temporaryDirectoryTask(async root => {
      const { configPath, sourceDir } = await createFixture(root)
      await put(join(root, "project/.livemark/components/Footer.tsx"), "escaped")
      await put(join(root, "project/.livemark/head.ts"), "escaped head")

      const targetDir = buildTarget({ configPath, sourceDir })

      expect(targetDir).toBe(join(root, "project/.livemark/.serve"))
      expect(read(targetDir, "components/Footer.tsx")).toBe("escaped")
      expect(read(targetDir, "components/Header.tsx")).toBe("default")
      expect(read(targetDir, "head.ts")).toBe("escaped head")
      expect(read(targetDir, "helpers/util.ts")).toBe("util")
      expect(existsSync(join(targetDir, "helpers/util.unit.ts"))).toBe(false)
    }))

  it("mounts a production build apart from the dev server's target", () =>
    temporaryDirectoryTask(async root => {
      const { configPath, sourceDir } = await createFixture(root)

      const targetDir = buildTarget({ configPath, sourceDir, command: "build" })

      expect(targetDir).toBe(join(root, "project/.livemark/.build"))
      expect(read(targetDir, "routes/index.tsx")).toBe("index")
      expect(existsSync(targetDirFor(configPath))).toBe(false)
    }))

  it("ignores itself in git and removes the legacy .target mount", () =>
    temporaryDirectoryTask(async root => {
      const { configPath, sourceDir } = await createFixture(root)
      const legacyDir = join(root, "project/.livemark/.target")
      await put(join(legacyDir, "routes/index.tsx"), "stale")

      const targetDir = buildTarget({ configPath, sourceDir })

      expect(read(targetDir, ".gitignore")).toBe("*\n")
      expect(existsSync(legacyDir)).toBe(false)
    }))

  it("marks the generated content as ESM for a CommonJS project", () =>
    temporaryDirectoryTask(async root => {
      const { configPath, sourceDir } = await createFixture(root)

      const targetDir = buildTarget({ configPath, sourceDir })

      expect(JSON.parse(read(targetDir, "package.json"))).toEqual({
        type: "module",
      })
    }))

  it("drops escapes removed since the last run", () =>
    temporaryDirectoryTask(async root => {
      const { configPath, sourceDir } = await createFixture(root)
      const overrides = join(root, "project/.livemark")
      await put(join(overrides, "components/Footer.tsx"), "escaped")
      await put(join(overrides, "routes/about.tsx"), "about")
      await put(join(overrides, "head.ts"), "escaped head")
      buildTarget({ configPath, sourceDir })

      await rm(join(overrides, "components"), { recursive: true })
      await rm(join(overrides, "routes"), { recursive: true })
      await rm(join(overrides, "head.ts"))
      const targetDir = buildTarget({ configPath, sourceDir })

      expect(read(targetDir, "components/Footer.tsx")).toBe("default")
      expect(existsSync(join(targetDir, "routes/about.tsx"))).toBe(false)
      expect(read(targetDir, "head.ts")).toBe("head")
    }))

  it("keeps generated entries between runs", () =>
    temporaryDirectoryTask(async root => {
      const { configPath, sourceDir } = await createFixture(root)
      const targetDir = buildTarget({ configPath, sourceDir })
      await put(join(targetDir, "cache/changelog/entry.md"), "cached")

      buildTarget({ configPath, sourceDir })

      expect(read(targetDir, "cache/changelog/entry.md")).toBe("cached")
    }))

  it("links node_modules to livemark's dependencies and repairs a stale link", () =>
    temporaryDirectoryTask(async root => {
      const { configPath, sourceDir } = await createFixture(root)
      const link = join(targetDirFor(configPath), "node_modules")
      const dependencyDir = realpathSync(join(root, "livemark/node_modules"))

      buildTarget({ configPath, sourceDir })
      expect(readlinkSync(link)).toBe(dependencyDir)

      await rm(link)
      await mkdir(join(root, "elsewhere"))
      await symlink(join(root, "elsewhere"), link, "junction")
      buildTarget({ configPath, sourceDir })

      expect(readlinkSync(link)).toBe(dependencyDir)
      expect(existsSync(join(root, "elsewhere"))).toBe(true)
    }))
})

async function createFixture(root: string) {
  const sourceDir = join(root, "livemark/source")
  await put(join(sourceDir, "components/Footer.tsx"), "default")
  await put(join(sourceDir, "components/Header.tsx"), "default")
  await put(join(sourceDir, "routes/index.tsx"), "index")
  await put(join(sourceDir, "helpers/util.ts"), "util")
  await put(join(sourceDir, "helpers/util.unit.ts"), "test")
  await put(join(sourceDir, "head.ts"), "head")
  await mkdir(join(root, "livemark/node_modules"))
  const configPath = join(root, "project/livemark.config.ts")
  await put(configPath, "export default {}")
  return { configPath, sourceDir }
}

async function put(path: string, content: string) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content)
}

function read(dir: string, path: string) {
  return readFileSync(join(dir, path), "utf-8")
}
