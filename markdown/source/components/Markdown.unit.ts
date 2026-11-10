import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { describe, expect, it } from "vite-plus/test"

const SOURCE = join(import.meta.dirname, "..")

describe("@livemark/markdown boundaries", () => {
  it("imports nothing from livemark here or in @livemark/vite", () => {
    const vite = join(SOURCE, "..", "..", "vite", "source")
    const offenders = [SOURCE, vite].flatMap(dir =>
      readdirSync(dir, { recursive: true, encoding: "utf8" })
        .filter(file => /\.(tsx?)$/.test(file))
        .filter(file =>
          /from\s+["']livemark[/"']/.test(readFileSync(join(dir, file), "utf8")),
        )
        .map(file => join(dir, file)),
    )
    expect(offenders).toEqual([])
  })

  it("reaches no livemark: virtual module from its public entries", () => {
    const entries = ["components/Markdown.tsx", "hooks/messages.ts", "hooks/icons.ts"]
    expect(readVirtualImports(entries.map(entry => join(SOURCE, entry)))).toEqual([])
  })
})

// Relative imports, dynamic ones included, from each entry: the specifiers that name a
// `livemark:` virtual module, which only a Livemark site resolves
function readVirtualImports(entries: string[]) {
  const seen = new Set<string>()
  const found: string[] = []
  const stack = [...entries]
  while (stack.length > 0) {
    const file = stack.pop()
    if (!file || seen.has(file)) continue
    seen.add(file)
    const code = readFileSync(file, "utf8")
    for (const match of code.matchAll(IMPORT)) {
      const specifier = match[1] ?? match[2] ?? ""
      if (specifier.startsWith("livemark:")) found.push(`${specifier} ← ${file}`)
      if (specifier.startsWith(".")) stack.push(resolve(dirname(file), specifier))
    }
  }
  return found
}

const IMPORT =
  /(?:import|export)\s[^"']*?\bfrom\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g
