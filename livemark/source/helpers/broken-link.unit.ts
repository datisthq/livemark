import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { explainPrerenderError } from "./broken-link.ts"

describe("explainPrerenderError", () => {
  it("names the pages that link to a path nothing is built at", () =>
    temporaryDirectoryTask(dir => {
      page(dir, "usage/index.html", '<a href="/nope/">x</a><a href="/guide/">y</a>')
      page(dir, "guide/index.html", '<a href="/nope/">x</a>')
      page(dir, "index.html", '<a href="/guide/">y</a>')
      const error = new Error("Failed to fetch /nope/: Not Found")

      const explained = explainPrerenderError(error, dir)

      expect(explained?.message).toBe(
        'Broken link "/nope/" on /guide/, /usage/: no page is built at that path',
      )
    }))

  it("explains an empty site when the home page itself is missing", () =>
    temporaryDirectoryTask(dir => {
      const explained = explainPrerenderError(
        new Error("Failed to fetch /: Not Found"),
        dir,
      )

      expect(explained?.message).toMatch(/No articles found/)
    }))

  it("leaves any other error alone", () =>
    temporaryDirectoryTask(dir => {
      expect(explainPrerenderError(new Error("boom"), dir)).toBeUndefined()
      expect(explainPrerenderError("boom", dir)).toBeUndefined()
    }))
})

function page(dir: string, path: string, html: string) {
  mkdirSync(join(dir, path, ".."), { recursive: true })
  writeFileSync(join(dir, path), html)
}
