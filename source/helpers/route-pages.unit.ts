import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { listRoutePages } from "./route-pages.ts"

describe("listRoutePages", () => {
  it("lists static routes and skips dynamic, root and ignored files", () =>
    temporaryDirectoryTask(async dir => {
      const files = [
        "__root.tsx",
        "$.tsx",
        "$section.rss[.]xml.tsx",
        "index.tsx",
        "about.tsx",
        "pricing/index.tsx",
        "pricing/plans.tsx",
        "blog.archive.tsx",
        "(marketing)/team.tsx",
        "_layout/contact.tsx",
        "-landing/Hero.tsx",
        "feed[.]json.ts",
        "notes.md",
      ]
      for (const file of files) await put(join(dir, file))

      expect(listRoutePages(dir)).toEqual([
        "/",
        "/about/",
        "/blog/archive/",
        "/contact/",
        "/feed.json",
        "/pricing/",
        "/pricing/plans/",
        "/team/",
      ])
    }))

  it("lists nothing for a project without routes", () =>
    temporaryDirectoryTask(dir => {
      expect(listRoutePages(join(dir, "routes"))).toEqual([])
    }))
})

async function put(path: string) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, "")
}
