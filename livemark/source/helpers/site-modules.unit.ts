import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { SITE_MODULES, resolveMarkdownImport, resolveSiteModule } from "./site-modules.ts"

const TARGET = join("/project", ".livemark", ".serve")

describe("resolveSiteModule", () => {
  it("sends a relative import of a site module to its twin", () => {
    const importer = join(TARGET, "components", "Callout.tsx")
    expect(
      resolveSiteModule({
        id: "../helpers/site-messages.ts",
        importer,
        targetDir: TARGET,
      }),
    ).toBe(join(TARGET, "helpers", "site-messages.site.ts"))
  })

  it("keeps the query, and covers a dynamic import beside the module", () => {
    const importer = join(TARGET, "helpers", "dynamic-icon.tsx?v=1")
    expect(
      resolveSiteModule({
        id: "./dynamic-icon-resolver.tsx?import",
        importer,
        targetDir: TARGET,
      }),
    ).toBe(`${join(TARGET, "helpers", "dynamic-icon-resolver.site.tsx")}?import`)
  })

  it("leaves other modules, bare specifiers and files outside the target alone", () => {
    const importer = join(TARGET, "components", "Card.tsx")
    expect(
      resolveSiteModule({ id: "../helpers/icon-names.ts", importer, targetDir: TARGET }),
    ).toBeUndefined()
    expect(
      resolveSiteModule({ id: "livemark/hooks/site", importer, targetDir: TARGET }),
    ).toBeUndefined()
    expect(
      resolveSiteModule({
        id: "./helpers/site-messages.ts",
        importer: join("/elsewhere", "x.ts"),
        targetDir: TARGET,
      }),
    ).toBeUndefined()
  })
})

describe("SITE_MODULES", () => {
  it("pairs each clean module in @livemark/markdown with a twin here", () => {
    const markdown = join(import.meta.dirname, "..", "..", "..", "markdown", "source")
    for (const name of SITE_MODULES) {
      expect(existsSync(join(markdown, name))).toBe(true)
      const twin = name.replace(/\.(tsx?)$/, ".site.$1")
      expect(existsSync(join(import.meta.dirname, "..", twin))).toBe(true)
    }
  })
})

describe("resolveMarkdownImport", () => {
  it("points @livemark/markdown paths at their copy in the target", () =>
    temporaryDirectoryTask(targetDir => {
      for (const file of [
        "elements/button.tsx",
        "models/message.ts",
        "helpers/article-link.ts",
      ]) {
        mkdirSync(join(targetDir, file, ".."), { recursive: true })
        writeFileSync(join(targetDir, file), "")
      }
      const resolve = (id: string) => resolveMarkdownImport({ id, targetDir })
      expect(resolve("@livemark/markdown/elements/button")).toBe(
        join(targetDir, "elements/button.tsx"),
      )
      expect(resolve("@livemark/markdown/models/message.ts?v=1")).toBe(
        `${join(targetDir, "models/message.ts")}?v=1`,
      )
      expect(resolve("@livemark/markdown/helpers/article-link.ts")).toBe(
        join(targetDir, "helpers/article-link.site.ts"),
      )
      expect(resolve("@livemark/markdown/vite")).toBeUndefined()
      expect(resolve("livemark/elements/button")).toBeUndefined()
    }))
})
