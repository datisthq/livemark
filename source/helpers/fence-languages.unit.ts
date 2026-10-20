import { describe, expect, it } from "vite-plus/test"
import { collectFenceLanguages } from "./fence-languages.ts"

describe("collectFenceLanguages", () => {
  it("should collect the languages fences name", async () => {
    const content =
      "```ts\nconst a = 1\n```\n\n~~~bash\nls\n~~~\n\n- item\n\n  ```yaml\n  a: 1\n  ```"
    const langs = await collectFenceLanguages(content)
    expect(langs).toEqual(expect.arrayContaining(["typescript", "shellscript", "yaml"]))
  })

  it("should resolve aliases and info-string metadata", async () => {
    const langs = await collectFenceLanguages('```js title="a.js" {1}\nfoo()\n```')
    expect(langs).toEqual(["javascript"])
  })

  it("should add the languages a grammar embeds lazily", async () => {
    const langs = await collectFenceLanguages("````md\n```js\nfoo()\n```\n````")
    expect(langs).toEqual(expect.arrayContaining(["markdown", "javascript", "html"]))
  })

  it("should skip languages Shiki does not bundle", async () => {
    const langs = await collectFenceLanguages(
      "```npm\ni livemark\n```\n\n```\nplain\n```",
    )
    expect(langs).toEqual([])
  })
})
