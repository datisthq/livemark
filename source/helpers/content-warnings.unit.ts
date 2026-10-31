import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { findContentWarnings } from "./content-warnings.ts"

const DIRECTIVES = new Set(["tip", "card", "video"])

describe("findContentWarnings", () => {
  it("flags directives that render as text and images that are missing", () =>
    temporaryDirectoryTask(root => {
      mkdirSync(join(root, "docs/images"), { recursive: true })
      writeFileSync(join(root, "docs/images/ok.png"), "")
      const text = [
        "---",
        "title: Usage",
        "---",
        "::: tip",
        ":::tip",
        ":::tipp",
        '::video{type="youtube"}',
        "![ok](./images/ok.png) ![gone](./images/gone.png)",
        '<img src="images/none.svg" alt="">',
        "![remote](https://example.com/a.png) ![root](/logo.png)",
      ].join("\n")

      const warnings = findContentWarnings({
        text,
        filePath: join(root, "docs/usage.md"),
        directives: DIRECTIVES,
      })

      expect(warnings).toEqual([
        'line 4: "::: tip" has a space after the colons, so it renders as text; write ":::tip"',
        'line 6: unknown directive ":::tipp" renders as text',
        'line 8: image "./images/gone.png" not found',
        'line 9: image "images/none.svg" not found',
      ])
    }))

  it("ignores everything inside fenced code", () =>
    temporaryDirectoryTask(root => {
      const text = ["```md", "::: tip", "![gone](./gone.png)", "```"].join("\n")

      const warnings = findContentWarnings({
        text,
        filePath: join(root, "docs/usage.md"),
        directives: DIRECTIVES,
      })

      expect(warnings).toEqual([])
    }))
})
