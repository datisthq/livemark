import { create, insertMultiple, search } from "@orama/orama"
import { describe, expect, it } from "vite-plus/test"
import { createSearchTokenizer } from "./search-tokenizer.ts"

describe("createSearchTokenizer", () => {
  it("should keep the default tokenizer for a spaced language", () => {
    expect(createSearchTokenizer("en")).toBeUndefined()
    expect(createSearchTokenizer("es")).toBeUndefined()
  })

  it("should split Chinese into words and lowercase Latin ones", () => {
    const tokenizer = createSearchTokenizer("zh")
    expect(tokenizer?.tokenize("在 Livemark 中配置侧边栏。")).toEqual(
      expect.arrayContaining(["livemark", "配置"]),
    )
  })

  it("should match the region-tagged form of a language", () => {
    expect(createSearchTokenizer("zh-Hant")).toBeDefined()
  })

  it("should find a Chinese article by a word inside a sentence", async () => {
    const tokenizer = createSearchTokenizer("zh")
    const db = create({ schema: { text: "string" }, components: { tokenizer } })
    await insertMultiple(db, [
      { id: "config", text: "在配置文件中设置网站标题和导航。" },
      { id: "deploy", text: "把网站部署到 Cloudflare 或 Netlify。" },
    ])
    const ids = async (term: string) =>
      (await search(db, { term })).hits.map(hit => hit.id)
    expect(await ids("配置")).toEqual(["config"])
    expect(await ids("部署")).toEqual(["deploy"])
    expect(await ids("cloudflare")).toEqual(["deploy"])
  })

  it("should split Japanese into words", () => {
    expect(createSearchTokenizer("ja")?.tokenize("サイトを公開する")).toContain("サイト")
  })
})
