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

  it("reports a broken article readably, once per error, until it is fixed", () =>
    withProject(async (root, store) => {
      const path = join(root, "docs/broken.md")
      writeFileSync(path, "---\norder: first\n---\nBody")
      const error = vi.spyOn(console, "error").mockImplementation(() => {})
      await store.list()
      await store.sync(path)
      expect(error).toHaveBeenCalledTimes(1)
      expect(error.mock.calls[0]?.[0]).toMatch(/order/)
      expect(error.mock.calls[0]?.[0]).not.toMatch(/"code"/)
      expect(store.readFailures()).toEqual([
        ["docs/broken.md", expect.stringMatching(/expected number/)],
      ])

      writeFileSync(path, "---\norder: 1\n---\nBody")
      await store.sync(path)
      expect(store.readFailures()).toEqual([])
      error.mockRestore()
    }))

  it("refuses to vouch for a site that left an article out", () =>
    withProject(async (root, store) => {
      writeFileSync(join(root, "docs/broken.md"), "---\norder: first\n---\nBody")
      const error = vi.spyOn(console, "error").mockImplementation(() => {})
      await store.list()
      expect(() => store.assertLoaded()).toThrow(
        "1 article failed to load, as reported above: docs/broken.md",
      )
      writeFileSync(join(root, "docs/broken.md"), "---\norder: 1\n---\nBody")
      await store.sync(join(root, "docs/broken.md"))
      expect(() => store.assertLoaded()).not.toThrow()
      error.mockRestore()
    }))

  it("warns once about Markdown that renders wrong, again only when it changes", () =>
    withProject(async (root, store) => {
      const path = join(root, "docs/guide.md")
      writeFileSync(path, "# Guide\n\n::: tip\nHi\n:::")
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      await store.list()
      await store.sync(path)
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0]?.[0]).toMatch(/docs\/guide\.md:\nline 3: "::: tip"/)
      warn.mockRestore()
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
