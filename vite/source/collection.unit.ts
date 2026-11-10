import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { defineCollection, markdown, type MarkdownPluginOptions } from "./index.ts"

describe("markdown collections", () => {
  it("serves entries and a lazy loader per entry as a virtual module", async () => {
    await withFiles({ "posts/a.md": "---\ntitle: A\n---\nHello" }, async root => {
      const blog = defineCollection({ name: "blog", include: "posts/*.md", root })
      const plugin = createHooks({ collections: [blog] })
      const id = await plugin.resolveId("virtual:livemark/collection/blog")
      expect(id).toBe("\0virtual:livemark/collection/blog")
      expect(await plugin.resolveId("virtual:livemark/collection/other")).toBeNull()
      const code = await plugin.load(String(id))
      expect(code).toContain('"frontmatter":{"title":"A"}')
      expect(code).toContain(
        `["posts/a", () => import(${JSON.stringify(join(root, "posts/a.md"))})]`,
      )
      expect(code).not.toContain("Hello")
    })
  })

  it("compiles a collection's files even when `include` leaves them out", async () => {
    await withFiles({}, async root => {
      const blog = defineCollection({ name: "blog", include: "posts/*.md", root })
      const plugin = createHooks({ include: /docs\//, collections: [blog] })
      expect(await plugin.transform("# A", join(root, "posts/a.md"))).toMatch(
        /MarkdownContent/,
      )
      expect(await plugin.transform("# A", join(root, "other/a.md"))).toBeNull()
    })
  })

  it("refuses two collections with one name", () => {
    const a = defineCollection({ name: "a", include: "*.md" })
    expect(() => markdown({ collections: [a, a] })).toThrow(/used twice/)
  })
})

function createHooks(options: MarkdownPluginOptions) {
  const plugin = markdown(options)
  const context = {
    warn: () => undefined,
    resolve: () => Promise.resolve(null),
  }
  const call = async (hook: unknown, args: unknown[]) => {
    if (typeof hook !== "object" || hook === null || !("handler" in hook)) {
      throw new Error("the plugin lacks this hook")
    }
    const handler = hook.handler
    if (typeof handler !== "function") throw new Error("the hook has no handler")
    const result: unknown = await Reflect.apply(handler, context, args)
    if (typeof result === "object" && result !== null && "code" in result) {
      return String(result.code)
    }
    return result ?? null
  }
  return {
    resolveId: (id: string) => call(plugin.resolveId, [id]),
    load: (id: string) => call(plugin.load, [id]),
    transform: (source: string, id: string) => call(plugin.transform, [source, id]),
  }
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
