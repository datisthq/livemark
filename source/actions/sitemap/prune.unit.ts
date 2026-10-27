import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { pruneSitemap } from "./prune.ts"

describe("pruneSitemap", () => {
  it("drops the anchor links the crawler recorded as pages", () =>
    temporaryDirectoryTask(async clientDir => {
      await mkdir(join(clientDir, "guide"))
      await writeFile(
        join(clientDir, "guide/index.html"),
        '<link rel="canonical" href="https://x.dev/guide/"/>',
      )
      await writeFile(
        join(clientDir, "sitemap.xml"),
        `<urlset>
  <url>
    <loc>https://x.dev/guide/</loc>
  </url>
  <url>
    <loc>https://x.dev/guide/#install</loc>
  </url>
</urlset>`,
      )

      pruneSitemap({ clientDir, site: "https://x.dev" })

      const xml = await readFile(join(clientDir, "sitemap.xml"), "utf-8")
      expect(xml).toContain("<loc>https://x.dev/guide/</loc>")
      expect(xml).not.toContain("#install")
    }))
})
