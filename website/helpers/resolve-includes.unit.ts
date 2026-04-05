import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vite-plus/test"
import { temporaryDirectory } from "tempy"
import { resolveIncludes } from "./resolve-includes.ts"

describe("resolveIncludes", () => {
  it("should replace include directive with file content", () => {
    const dir = temporaryDirectory()
    writeFileSync(join(dir, "snippet.md"), "Hello from snippet")
    const result = resolveIncludes(
      '::include{file="snippet.md"}',
      join(dir, "main.md"),
    )
    expect(result).toBe("Hello from snippet")
  })

  it("should strip frontmatter from included files", () => {
    const dir = temporaryDirectory()
    writeFileSync(
      join(dir, "snippet.md"),
      "---\ntitle: Test\n---\nContent here",
    )
    const result = resolveIncludes(
      '::include{file="snippet.md"}',
      join(dir, "main.md"),
    )
    expect(result).toBe("Content here")
  })

  it("should preserve surrounding content", () => {
    const dir = temporaryDirectory()
    writeFileSync(join(dir, "snippet.md"), "Included text")
    const result = resolveIncludes(
      'Before\n\n::include{file="snippet.md"}\n\nAfter',
      join(dir, "main.md"),
    )
    expect(result).toBe("Before\n\nIncluded text\n\nAfter")
  })

  it("should keep directive when file is missing", () => {
    const result = resolveIncludes(
      '::include{file="nonexistent.md"}',
      "/tmp/main.md",
    )
    expect(result).toBe('::include{file="nonexistent.md"}')
  })

  it("should resolve nested includes", () => {
    const dir = temporaryDirectory()
    writeFileSync(join(dir, "inner.md"), "Inner content")
    writeFileSync(join(dir, "outer.md"), '::include{file="inner.md"}')
    const result = resolveIncludes(
      '::include{file="outer.md"}',
      join(dir, "main.md"),
    )
    expect(result).toBe("Inner content")
  })

  it("should limit recursion depth", () => {
    const dir = temporaryDirectory()
    writeFileSync(join(dir, "recursive.md"), '::include{file="recursive.md"}')
    const result = resolveIncludes(
      '::include{file="recursive.md"}',
      join(dir, "main.md"),
    )
    expect(result).toBe('::include{file="recursive.md"}')
  })

  it("should resolve relative paths from included file location", () => {
    const dir = temporaryDirectory()
    mkdirSync(join(dir, "sub"))
    writeFileSync(join(dir, "sub", "child.md"), "Child content")
    writeFileSync(join(dir, "parent.md"), '::include{file="sub/child.md"}')
    const result = resolveIncludes(
      '::include{file="parent.md"}',
      join(dir, "main.md"),
    )
    expect(result).toBe("Child content")
  })

  it("should handle multiple includes in one file", () => {
    const dir = temporaryDirectory()
    writeFileSync(join(dir, "a.md"), "Alpha")
    writeFileSync(join(dir, "b.md"), "Beta")
    const result = resolveIncludes(
      '::include{file="a.md"}\n\n::include{file="b.md"}',
      join(dir, "main.md"),
    )
    expect(result).toBe("Alpha\n\nBeta")
  })

  it("should wrap code files in fenced blocks", () => {
    const dir = temporaryDirectory()
    writeFileSync(join(dir, "example.ts"), 'const x = 1\nconst y = "hello"')
    const result = resolveIncludes(
      '::include{file="example.ts"}',
      join(dir, "main.md"),
    )
    expect(result).toBe(
      '```typescript title="example.ts"\nconst x = 1\nconst y = "hello"\n```',
    )
  })

  it("should pass meta to code fence", () => {
    const dir = temporaryDirectory()
    writeFileSync(join(dir, "app.tsx"), "export default function App() {}")
    const result = resolveIncludes(
      '::include{file="app.tsx" meta="{1} lineNumbers"}',
      join(dir, "main.md"),
    )
    expect(result).toBe(
      '```tsx title="app.tsx" {1} lineNumbers\nexport default function App() {}\n```',
    )
  })

  it("should treat unknown extensions as markdown", () => {
    const dir = temporaryDirectory()
    writeFileSync(join(dir, "notes.txt"), "Plain text")
    const result = resolveIncludes(
      '::include{file="notes.txt"}',
      join(dir, "main.md"),
    )
    expect(result).toBe("Plain text")
  })
})
