import { describe, expect, it } from "vite-plus/test"
import { readCanonical, removeNonCanonicalUrls } from "./sitemap.ts"

const xml = `<urlset>
  <url>
    <loc>https://x.dev/changelog/1-0-0/</loc>
  </url>
  <url>
    <loc>https://x.dev/es/changelog/1-0-0/</loc>
  </url>
</urlset>`

describe("removeNonCanonicalUrls", () => {
  it("drops pages whose canonical points elsewhere", () => {
    const pruned = removeNonCanonicalUrls(xml, loc =>
      loc.replace("/es/changelog/", "/changelog/"),
    )
    expect(pruned).toContain("<loc>https://x.dev/changelog/1-0-0/</loc>")
    expect(pruned).not.toContain("/es/changelog/")
  })

  it("keeps pages without a readable canonical", () => {
    expect(removeNonCanonicalUrls(xml, () => undefined)).toBe(xml)
  })
})

describe("readCanonical", () => {
  it("reads the canonical link of a page", () => {
    expect(readCanonical('<link rel="canonical" href="https://x.dev/a/"/>')).toBe(
      "https://x.dev/a/",
    )
  })
})
