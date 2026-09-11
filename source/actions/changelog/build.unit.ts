import { describe, expect, it } from "vite-plus/test"
import { escapeMdxAngles, splitLocalChangelog } from "./build.ts"

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
