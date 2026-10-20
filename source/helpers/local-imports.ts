import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

// Enough for this repo's own source, which always imports by full relative path.
const RELATIVE_IMPORT = /(?:from|import)\s*["'](\.{1,2}\/[^"']+)["']/g

/** The module and every file it reaches through relative imports, as absolute paths. */
export function collectLocalImports(entry: string) {
  const seen = new Set<string>()
  const queue = [resolve(entry)]
  for (const file of queue) {
    if (seen.has(file) || !existsSync(file)) continue
    seen.add(file)
    for (const [, specifier] of readFileSync(file, "utf8").matchAll(RELATIVE_IMPORT)) {
      if (specifier) queue.push(resolve(dirname(file), specifier))
    }
  }
  return [...seen]
}
