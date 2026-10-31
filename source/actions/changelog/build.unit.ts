import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { basename, dirname, join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { partitionBySection } from "../../helpers/section.ts"
import { Config } from "../../models/config.ts"
import type { ChangelogSection } from "../../models/section.ts"
import { cacheDirFor } from "../../helpers/target-dir.ts"
import {
  buildChangelog,
  cacheIncludeGlob,
  changelogCacheDir,
  escapeMdxAngles,
  splitLocalChangelog,
} from "./build.ts"

describe("buildChangelog", () => {
  it("keeps several changelog sections apart when they share a version", () =>
    temporaryDirectoryTask(async root => {
      const configPath = join(root, "livemark.config.ts")
      const standard: ChangelogSection = {
        type: "changelog",
        title: "Changelog",
        prefix: "/changelog/",
        source: "standard/CHANGELOG.md",
        version: true,
        position: "sidebar",
      }
      const python: ChangelogSection = {
        type: "changelog",
        title: "Changelog",
        prefix: "/python/changelog/",
        source: "python/CHANGELOG.md",
        version: true,
        position: "sidebar",
      }
      const config = makeConfig(root, [standard, python])

      await writeChangelog(
        root,
        "standard",
        "## 0.2.0\n\nStandard two.\n\n## 0.1.0\n\nStandard one.\n",
      )
      await writeChangelog(root, "python", "## 0.2.0\n\nPython two.\n")

      try {
        await buildChangelog(standard, config)
        await buildChangelog(python, config)

        const standardDir = changelogCacheDir(standard, config)
        const pythonDir = changelogCacheDir(python, config)
        const cacheRoot = join(cacheDirFor(configPath), "changelog")
        expect(dirname(standardDir)).toBe(cacheRoot)
        expect(dirname(pythonDir)).toBe(cacheRoot)
        expect(basename(standardDir)).toMatch(/^changelog-[0-9a-f]{8}$/)
        expect(basename(pythonDir)).toMatch(/^python-changelog-[0-9a-f]{8}$/)
        expect(cacheIncludeGlob(python, config)).toBe(join(pythonDir, "*.md"))

        expect((await readdir(standardDir)).sort()).toEqual(["0-1-0.md", "0-2-0.md"])
        expect(await readdir(pythonDir)).toEqual(["0-2-0.md"])

        const standardEntry = await readFile(join(standardDir, "0-2-0.md"), "utf-8")
        const pythonEntry = await readFile(join(pythonDir, "0-2-0.md"), "utf-8")
        expect(standardEntry).toContain("path: /changelog/0-2-0/")
        expect(standardEntry).toContain("Standard two.")
        expect(pythonEntry).toContain("path: /python/changelog/0-2-0/")
        expect(pythonEntry).toContain("Python two.")

        const olderEntry = await readFile(join(standardDir, "0-1-0.md"), "utf-8")
        const articles = [standardEntry, olderEntry, pythonEntry].map(markdown => ({
          path: markdown.match(/^path: (.+)$/m)?.[1] ?? "",
        }))
        const buckets = partitionBySection(articles, [standard, python])
        expect(buckets.get("/changelog/")?.map(a => a.path)).toEqual([
          "/changelog/0-2-0/",
          "/changelog/0-1-0/",
        ])
        expect(buckets.get("/python/changelog/")?.map(a => a.path)).toEqual([
          "/python/changelog/0-2-0/",
        ])
      } finally {
        await rm(cacheDirFor(configPath), { recursive: true, force: true })
      }
    }))

  it("cleans only its own cache directory on rebuild", () =>
    temporaryDirectoryTask(async root => {
      const configPath = join(root, "livemark.config.ts")
      const standard: ChangelogSection = {
        type: "changelog",
        title: "Changelog",
        prefix: "/changelog/",
        source: "standard/CHANGELOG.md",
        position: "sidebar",
      }
      const python: ChangelogSection = {
        type: "changelog",
        title: "Changelog",
        prefix: "/python/changelog/",
        source: "python/CHANGELOG.md",
        position: "sidebar",
      }
      const config = makeConfig(root, [standard, python])

      await writeChangelog(root, "standard", "## 0.2.0\n\nStandard two.\n")
      await writeChangelog(root, "python", "## 0.3.0\n\nPython three.\n")

      try {
        await buildChangelog(standard, config)
        await buildChangelog(python, config)
        await writeChangelog(root, "standard", "## 0.4.0\n\nStandard four.\n")
        await buildChangelog(standard, config)

        expect(await readdir(changelogCacheDir(standard, config))).toEqual(["0-4-0.md"])
        expect(await readdir(changelogCacheDir(python, config))).toEqual(["0-3-0.md"])
      } finally {
        await rm(cacheDirFor(configPath), { recursive: true, force: true })
      }
    }))

  it("drops an entry's own title and moves its subsections up one level", () =>
    temporaryDirectoryTask(async root => {
      const section: ChangelogSection = {
        type: "changelog",
        title: "Changelog",
        prefix: "/changelog/",
        source: "CHANGELOG.md",
        position: "sidebar",
      }
      const config = makeConfig(root, [section])
      const notes = "## 1.0.0\n\n# 1.0.0 (2026-01-01)\n\n### Features\n\n- one\n"
      await writeFile(join(root, "CHANGELOG.md"), notes, "utf-8")

      await buildChangelog(section, config)

      const entry = await readFile(
        join(changelogCacheDir(section, config), "1-0-0.md"),
        "utf-8",
      )
      expect(entry).not.toContain("(2026-01-01)")
      expect(entry).toContain("## Features")
      expect(entry).not.toContain("### Features")
    }))

  it("keeps sections apart when their prefixes slugify to the same key", () =>
    temporaryDirectoryTask(async root => {
      const configPath = join(root, "livemark.config.ts")
      const nested: ChangelogSection = {
        type: "changelog",
        title: "Changelog",
        prefix: "/python/changelog/",
        source: "nested/CHANGELOG.md",
        position: "sidebar",
      }
      const flat: ChangelogSection = {
        type: "changelog",
        title: "Changelog",
        prefix: "/python-changelog/",
        source: "flat/CHANGELOG.md",
        position: "sidebar",
      }
      const config = makeConfig(root, [nested, flat])

      await writeChangelog(root, "nested", "## 0.1.0\n\nNested one.\n")
      await writeChangelog(root, "flat", "## 0.2.0\n\nFlat two.\n")

      try {
        await buildChangelog(nested, config)
        await buildChangelog(flat, config)

        const nestedDir = changelogCacheDir(nested, config)
        const flatDir = changelogCacheDir(flat, config)
        expect(nestedDir).not.toBe(flatDir)
        expect(await readdir(nestedDir)).toEqual(["0-1-0.md"])
        expect(await readdir(flatDir)).toEqual(["0-2-0.md"])
      } finally {
        await rm(cacheDirFor(configPath), { recursive: true, force: true })
      }
    }))
})

describe("splitLocalChangelog", () => {
  it("splits by h2 headings", () => {
    const input = `# Changelog

## [0.2.0] - 2026-04-15

### Added

- Foo

## [0.1.0] - 2026-04-10

Initial release.
`
    const entries = splitLocalChangelog(input)
    expect(entries).toHaveLength(2)
    expect(entries[0]?.title).toBe("0.2.0")
    expect(entries[0]?.date).toBe("2026-04-15")
    expect(entries[0]?.slug).toBe("0-2-0")
    expect(entries[1]?.title).toBe("0.1.0")
    expect(entries[1]?.date).toBe("2026-04-10")
  })

  it("preserves h3 heading structure in body", () => {
    const input = `## 1.0.0

### Added

- Thing one
`
    const entries = splitLocalChangelog(input)
    expect(entries[0]?.body).toContain("### Added")
    expect(entries[0]?.body).toContain("- Thing one")
  })

  it("ignores ## inside fenced code blocks", () => {
    const input = `## 1.0.0

Some prose.

\`\`\`md
## Not a real version heading
\`\`\`

## 0.9.0

Older.
`
    const entries = splitLocalChangelog(input)
    expect(entries).toHaveLength(2)
    expect(entries[0]?.title).toBe("1.0.0")
    expect(entries[0]?.body).toContain("Not a real version heading")
    expect(entries[1]?.title).toBe("0.9.0")
  })

  it("handles bare version headings without brackets or date", () => {
    const input = `## v1.2.3

Release notes.
`
    const entries = splitLocalChangelog(input)
    expect(entries[0]?.title).toBe("v1.2.3")
    expect(entries[0]?.slug).toBe("v1-2-3")
    expect(entries[0]?.date).toBeUndefined()
  })
})

describe("escapeMdxAngles", () => {
  it("escapes a bare angle placeholder as an HTML entity", () => {
    // `\<` is honoured by remark but NOT by MDX's JSX-aware parser, which still
    // reads `\<name>` as an unclosed tag. Only the entity survives both.
    expect(escapeMdxAngles("a <name> b")).toBe("a &lt;name> b")
  })

  it("escapes a placeholder that follows a bare URL", () => {
    const input = "See https://fairspec.org/profiles/latest/<name>.json, ok."
    expect(escapeMdxAngles(input)).toBe(
      "See https://fairspec.org/profiles/latest/&lt;name>.json, ok.",
    )
  })

  it("leaves inline code spans alone", () => {
    expect(escapeMdxAngles("use `--resource <name>` here")).toBe(
      "use `--resource <name>` here",
    )
  })

  it("leaves fenced code blocks alone", () => {
    const input = "```sh\nfoo <bar>\n```"
    expect(escapeMdxAngles(input)).toBe(input)
  })
})

function makeConfig(root: string, sections: ChangelogSection[]) {
  const configPath = join(root, "livemark.config.ts")
  return { ...Config.parse({ root, configPath, sections }), base: undefined }
}

async function writeChangelog(root: string, dir: string, body: string) {
  await mkdir(join(root, dir), { recursive: true })
  await writeFile(join(root, dir, "CHANGELOG.md"), body, "utf-8")
}
