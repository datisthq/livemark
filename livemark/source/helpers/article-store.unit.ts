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

  it("gives a translation without a path its original's, prefixed", () =>
    withProject(async (root, store) => {
      writeFileSync(join(root, "docs/guide.md"), "---\npath: /start/\n---\n# Guide")
      writeFileSync(join(root, "docs/guide.es.md"), "# Guía")
      writeFileSync(join(root, "docs/hola.md"), "---\nlanguage: es\n---\n# Hola")
      const articles = await store.list()
      expect(articles.map(a => [a.file, a.path, a.key])).toEqual([
        ["docs/guide.es.md", "/es/start/", "/start/"],
        ["docs/guide.md", "/start/", "/start/"],
        ["docs/hola.md", "/es/hola/", "/hola/"],
        ["docs/index.md", "/", "/"],
      ])
    }, LANGUAGES))

  it("serves an explicit translation path as written, rejecting one off its prefix", () =>
    withProject(async (root, store) => {
      writeFileSync(join(root, "docs/guide.es.md"), "---\npath: /es/guia/\n---\n# Guía")
      writeFileSync(join(root, "docs/index.es.md"), "---\npath: /inicio/\n---\n# Inicio")
      const error = vi.spyOn(console, "error").mockImplementation(() => {})
      const articles = await store.list()
      expect(articles.find(a => a.file === "docs/guide.es.md")?.path).toBe("/es/guia/")
      expect(store.readFailures()).toEqual([
        ["docs/index.es.md", expect.stringMatching(/must start with "\/es\/"/)],
      ])
      error.mockRestore()
    }, LANGUAGES))

  it("moves a translation with its original's path", () =>
    withProject(async (root, store) => {
      writeFileSync(join(root, "docs/guide.es.md"), "# Guía")
      await store.list()
      writeFileSync(join(root, "docs/guide.md"), "---\npath: /start/\n---\n# Guide")
      await store.sync(join(root, "docs/guide.md"))
      const articles = await store.list()
      expect(articles.find(a => a.file === "docs/guide.es.md")?.path).toBe("/es/start/")
    }, LANGUAGES))

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
  options: Record<string, unknown> = {},
) {
  return temporaryDirectoryTask(async root => {
    mkdirSync(join(root, "docs"))
    writeFileSync(join(root, ".gitignore"), "")
    writeFileSync(join(root, "docs/index.md"), "# Home\n\nWelcome")
    writeFileSync(join(root, "docs/guide.md"), "# Guide\n\n## Part")
    await test(root, createArticleStore(readConfig(root, options)))
  })
}

const LANGUAGES = {
  languages: [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ],
}

function readConfig(root: string, options: Record<string, unknown> = {}) {
  return {
    ...Config.parse({
      root,
      configPath: join(root, "livemark.config.ts"),
      include: "docs/**/*.md",
      ...options,
    }),
    base: undefined,
  }
}
