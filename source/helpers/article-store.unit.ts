import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it, vi } from "vite-plus/test"
import { Config } from "../models/config.ts"
import { createArticleStore } from "./article-store.ts"

describe("createArticleStore", () => {
  it("loads the included articles in file order", () =>
    withProject(async (_, store) => {
      const articles = await store.list()
      expect(articles.map(a => [a.file, a.path, a.title])).toEqual([
        ["docs/guide.md", "/guide/", "Guide"],
        ["docs/index.md", "/", "Home"],
      ])
    }))

  it("syncs an edit, an addition and a deletion, ignoring files it does not include", () =>
    withProject(async (root, store) => {
      await store.list()
      writeFileSync(join(root, "docs/guide.md"), "---\ntitle: Renamed\n---\nBody")
      expect(await store.sync(join(root, "docs/guide.md"))).toBe(true)
      writeFileSync(join(root, "docs/added.md"), "# Added")
      expect(await store.sync(join(root, "docs/added.md"))).toBe(true)
      rmSync(join(root, "docs/index.md"))
      expect(await store.sync(join(root, "docs/index.md"))).toBe(true)
      writeFileSync(join(root, "docs/notes.txt"), "x")
      expect(await store.sync(join(root, "docs/notes.txt"))).toBe(false)
      const articles = await store.list()
      expect(articles.map(a => [a.file, a.title])).toEqual([
        ["docs/added.md", "Added"],
        ["docs/guide.md", "Renamed"],
      ])
    }))

  it("reports and leaves out an article with invalid frontmatter", () =>
    withProject(async (root, store) => {
      writeFileSync(join(root, "docs/broken.md"), "---\norder: first\n---\nBody")
      const error = vi.spyOn(console, "error").mockImplementation(() => {})
      const articles = await store.list()
      expect(articles.map(a => a.file)).not.toContain("docs/broken.md")
      expect(error).toHaveBeenCalledWith(expect.stringContaining("docs/broken.md"))
      error.mockRestore()
    }))

  it("serves a cached compile from a second store", () =>
    withProject(async (root, store) => {
      const [first] = await store.list()
      const again = createArticleStore(readConfig(root))
      const [second] = await again.list()
      expect(second?.mdx).toBe(first?.mdx)
    }))
})

function withProject(
  test: (root: string, store: ReturnType<typeof createArticleStore>) => Promise<void>,
) {
  return temporaryDirectoryTask(async root => {
    mkdirSync(join(root, "docs"))
    writeFileSync(join(root, ".gitignore"), "")
    writeFileSync(join(root, "docs/index.md"), "# Home\n\nWelcome")
    writeFileSync(join(root, "docs/guide.md"), "# Guide\n\n## Part")
    await test(root, createArticleStore(readConfig(root)))
  })
}

function readConfig(root: string) {
  return {
    ...Config.parse({
      root,
      configPath: join(root, "livemark.config.ts"),
      include: "docs/**/*.md",
    }),
    base: undefined,
  }
}
