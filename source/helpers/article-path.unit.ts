import { describe, expect, it } from "vite-plus/test"
import { resolveArticlePath } from "./article-path.ts"

describe("resolveArticlePath", () => {
  const include = ["docs/**/*.md"]

  it("derives a slashed path from the file name", () => {
    const path = resolveArticlePath({ file: "docs/usage.md", name: "usage", include })
    expect(path).toBe("/usage/")
  })

  it("keeps the folders below the include glob's base", () => {
    const install = resolveArticlePath({
      file: "docs/guide/install.md",
      name: "install",
      include,
    })
    const api = resolveArticlePath({
      file: "docs/api/install.md",
      name: "install",
      include,
    })
    expect(install).toBe("/guide/install/")
    expect(api).toBe("/api/install/")
  })

  it("names a folder by its index file and the root by the top one", () => {
    expect(
      resolveArticlePath({ file: "docs/guide/index.md", name: "index", include }),
    ).toBe("/guide/")
    expect(resolveArticlePath({ file: "docs/index.md", name: "index", include })).toBe(
      "/",
    )
  })

  it("slugifies every segment", () => {
    const path = resolveArticlePath({
      file: "docs/User Guide/Getting Started.md",
      name: "Getting Started",
      include,
    })
    expect(path).toBe("/user-guide/getting-started/")
  })

  it("matches the longest base among several globs, literal files included", () => {
    const globs = ["**/*.md", "docs/**/*.md", "README.md"]
    expect(
      resolveArticlePath({ file: "README.md", name: "README", include: globs }),
    ).toBe("/readme/")
    expect(
      resolveArticlePath({ file: "docs/guide/a.md", name: "a", include: globs }),
    ).toBe("/guide/a/")
  })

  it("takes the translation's name without its language suffix", () => {
    const path = resolveArticlePath({ file: "docs/guide/a.es.md", name: "a", include })
    expect(path).toBe("/guide/a/")
  })

  it("wraps a frontmatter path in slashes", () => {
    const file = "docs/x.md"
    expect(resolveArticlePath({ file, name: "x", include, path: "noslash" })).toBe(
      "/noslash/",
    )
    expect(resolveArticlePath({ file, name: "x", include, path: "/a/b" })).toBe("/a/b/")
    expect(resolveArticlePath({ file, name: "x", include, path: "/" })).toBe("/")
  })
})
