import { describe, expect, it } from "vite-plus/test"
import worker, { buildTwinPath } from "./worker.ts"

const assets: Record<string, string> = {
  "/guide/": "<html>guide</html>",
  "/guide/index.md": "# Guide\n",
  "/blog/": "<html>blog</html>",
  "/logo.svg": "<svg/>",
}

const env = {
  ASSETS: {
    async fetch(request: Request) {
      const body = assets[new URL(request.url).pathname]
      return body === undefined
        ? new Response("Not found", { status: 404 })
        : new Response(body, { headers: { "Content-Type": "text/html" } })
    },
  },
}

function get(path: string, accept = "text/html") {
  return worker.fetch(
    new Request(`https://example.com${path}`, { headers: { Accept: accept } }),
    env,
  )
}

describe("worker", () => {
  it("serves the twin when the request accepts markdown", async () => {
    const response = await get("/guide/", "text/markdown, text/html;q=0.9")
    expect(await response.text()).toBe("# Guide\n")
    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8")
    expect(response.headers.get("Vary")).toBe("Accept")
  })

  it("serves the page to a browser, varying on accept", async () => {
    const response = await get("/guide/")
    expect(await response.text()).toBe("<html>guide</html>")
    expect(response.headers.get("Vary")).toBe("Accept")
  })

  it("falls back to the page when it has no twin", async () => {
    const response = await get("/blog/", "text/markdown")
    expect(await response.text()).toBe("<html>blog</html>")
  })

  it("passes file requests through untouched", async () => {
    const response = await get("/logo.svg", "text/markdown")
    expect(await response.text()).toBe("<svg/>")
    expect(response.headers.get("Vary")).toBeNull()
  })
})

describe("buildTwinPath", () => {
  it("maps page paths with or without a trailing slash", () => {
    expect(buildTwinPath("/")).toBe("/index.md")
    expect(buildTwinPath("/guide/")).toBe("/guide/index.md")
    expect(buildTwinPath("/guide")).toBe("/guide/index.md")
  })

  it("skips paths naming a file", () => {
    expect(buildTwinPath("/llms.txt")).toBeUndefined()
    expect(buildTwinPath("/guide/index.md")).toBeUndefined()
  })
})
