import { describe, expect, it } from "vite-plus/test"
import { renderHeaders } from "./vite-agents.ts"

describe("renderHeaders", () => {
  it("links the home page to llms.txt and its markdown twin", () => {
    expect(renderHeaders({ hasSkills: false })).toBe(
      '/\n  Link: </llms.txt>; rel="describedby"; type="text/plain", </index.md>; rel="alternate"; type="text/markdown"\n',
    )
  })

  it("adds the skills index and mounts everything under base", () => {
    const headers = renderHeaders({ base: "/repo", hasSkills: true })
    expect(headers.startsWith("/repo/\n  Link: </repo/llms.txt>")).toBe(true)
    expect(headers).toContain(
      '</repo/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
    )
  })

  it("keeps the project's own rules ahead of the generated one", () => {
    const headers = renderHeaders({
      hasSkills: false,
      existing: "/*\n  X-Frame-Options: DENY\n\n",
    })
    expect(headers.startsWith("/*\n  X-Frame-Options: DENY\n\n/\n  Link: ")).toBe(true)
  })
})
