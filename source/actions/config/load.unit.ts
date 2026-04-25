import fs from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { loadConfig } from "./load.ts"

describe("loadConfig", () => {
  it("should throw when no config file exists", async () => {
    await expect(loadConfig("/nonexistent/config.ts")).rejects.toThrow()
  })

  it("should load config from explicit path", () =>
    temporaryDirectoryTask(async tmpDir => {
      const configPath = join(tmpDir, "livemark.config.ts")
      fs.writeFileSync(
        configPath,
        'export default { include: "articles/**/*.mdx" }\n',
      )
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
})
