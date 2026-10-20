import fs from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { loadConfig } from "./load.ts"

describe("loadConfig", () => {
  it("should throw when an explicit path points at a missing file", async () => {
    await expect(loadConfig("/nonexistent/config.ts")).rejects.toThrow(/not found/)
  })

  it("should return defaults when no path is given and cwd has no config", () =>
    temporaryDirectoryTask(async tmpDir => {
      const cwd = process.cwd()
      try {
        process.chdir(tmpDir)
        const config = await loadConfig()
        expect(config.title).toBe("Livemark")
        expect(config.include).toBe("**/*.md")
        expect(config.root).toBe(tmpDir)
        expect(config.configPath).toBe(join(tmpDir, "livemark.config.ts"))
      } finally {
        process.chdir(cwd)
      }
    }))

  it("should load config from explicit path", () =>
    temporaryDirectoryTask(async tmpDir => {
      const configPath = join(tmpDir, "livemark.config.ts")
      fs.writeFileSync(configPath, 'export default { include: "articles/**/*.mdx" }\n')
      const config = await loadConfig(configPath)
      expect(config.include).toBe("articles/**/*.mdx")
      expect(config.root).toBe(tmpDir)
    }))

  it("should apply defaults when fields are omitted", () =>
    temporaryDirectoryTask(async tmpDir => {
      const configPath = join(tmpDir, "livemark.config.ts")
      fs.writeFileSync(configPath, "export default {}\n")
      const config = await loadConfig(configPath)
      expect(config.include).toBe("**/*.md")
      expect(config.title).toBe("Livemark")
    }))

  it("should reload the files a config imports and list them as dependencies", () =>
    temporaryDirectoryTask(async tmpDir => {
      const configPath = join(tmpDir, "livemark.config.ts")
      const titlePath = join(tmpDir, "title.ts")
      fs.writeFileSync(
        configPath,
        'import { title } from "./title.ts"\nexport default { title }\n',
      )
      fs.writeFileSync(titlePath, 'export const title = "First"\n')
      const first = await loadConfig(configPath)
      fs.writeFileSync(titlePath, 'export const title = "Second"\n')
      const second = await loadConfig(configPath)
      expect(first.title).toBe("First")
      expect(second.title).toBe("Second")
      expect(second.configDependencies).toContain(titlePath)
    }))
})
