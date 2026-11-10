import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { defineCollection } from "./define.ts"

describe("defineCollection", () => {
  it("lists frontmatter without bodies, sorted by file, with default ids", async () => {
    await withFiles(
      {
        "posts/b.md": "---\ntitle: B\n---\nBody of b",
        "posts/a.mdx": "---\ntitle: A\n---\nBody of a",
        "posts/notes.txt": "not Markdown",
        "posts/node_modules/x.md": "---\ntitle: X\n---",
      },
      async root => {
        const blog = defineCollection({ name: "blog", include: "posts/**/*", root })
        expect(await blog.list()).toEqual([
          {
            id: "posts/a",
            file: "posts/a.mdx",
            frontmatter: { title: "A" },
            readingTime: 1,
          },
          {
            id: "posts/b",
            file: "posts/b.md",
            frontmatter: { title: "B" },
            readingTime: 1,
          },
        ])
      },
    )
  })

  it("validates frontmatter with the schema and names the file on failure", async () => {
    const schema = { parse: parseTitle }
    await withFiles({ "a.md": "---\ntitle: A\n---\n" }, async root => {
      const ok = defineCollection({ name: "ok", include: "*.md", root, schema })
      const [entry] = await ok.list()
      expect(entry?.frontmatter.title).toBe("A")
    })
    await withFiles({ "bad.md": "---\ntitel: A\n---\n" }, async root => {
      const bad = defineCollection({ name: "bad", include: "*.md", root, schema })
      await expect(bad.list()).rejects.toThrow(/bad\.md: invalid frontmatter/)
    })
  })

  it("takes ids from `id`, applies `exclude` and refuses a repeated id", async () => {
    const files = {
      "blog/one/en.md": "# One",
      "blog/one/pt.md": "# Um",
      "blog/draft/en.md": "# Draft",
    }
    await withFiles(files, async root => {
      const blog = defineCollection({
        name: "blog",
        include: "blog/*/*.md",
        exclude: "blog/draft/**",
        root,
        id: file => file.split("/").slice(1).join("/").replace(/\.md$/, ""),
      })
      expect((await blog.list()).map(entry => entry.id)).toEqual(["one/en", "one/pt"])
      const flat = defineCollection({
        name: "flat",
        include: "blog/*/*.md",
        root,
        id: file => file.split("/")[1] ?? file,
      })
      await expect(flat.list()).rejects.toThrow(/id "one" repeats/)
    })
  })

  it("counts reading time from prose at 200 words a minute, without code", async () => {
    const prose = Array.from({ length: 600 }, () => "word").join(" ")
    const code = Array.from({ length: 2000 }, () => "token").join(" ")
    await withFiles({ "a.md": `${prose}\n\n\`\`\`ts\n${code}\n\`\`\`\n` }, async root => {
      const [entry] = await defineCollection({ name: "a", include: "*.md", root }).list()
      expect(entry?.readingTime).toBe(3)
    })
  })

  it("refuses a name that cannot be a module id", () => {
    expect(() => defineCollection({ name: "a/b", include: "*.md" })).toThrow(/name/)
  })
})

function parseTitle(data: unknown) {
  const title: unknown =
    typeof data === "object" && data ? Reflect.get(data, "title") : undefined
  if (typeof title !== "string") throw new Error("title is required")
  return { title }
}

async function withFiles(
  files: Record<string, string>,
  run: (root: string) => Promise<void>,
) {
  await temporaryDirectoryTask(async root => {
    for (const [file, content] of Object.entries(files)) {
      await mkdir(dirname(join(root, file)), { recursive: true })
      await writeFile(join(root, file), content)
    }
    await run(root)
  })
}
