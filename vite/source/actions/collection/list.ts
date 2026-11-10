import { glob, readFile } from "node:fs/promises"
import { matchesGlob, resolve, sep } from "node:path"
import { parseFrontmatter } from "@livemark/markdown/helpers/frontmatter.ts"
import type { Collection, CollectionEntry } from "./define.ts"

/** Read every file of a collection into an entry, sorted by file. */
export async function listCollection<T>(collection: Collection<T>) {
  const files = await findCollectionFiles(collection)
  const entries = await Promise.all(
    files.map(async file => {
      const source = await readFile(resolve(collection.root, file), "utf-8")
      const document = parseFrontmatter(source)
      let frontmatter: T
      try {
        frontmatter = collection.parseFrontmatter(
          Object.fromEntries(Object.entries(document.data)),
        )
      } catch (error) {
        throw new Error(
          `${file}: invalid frontmatter in collection "${collection.name}"`,
          {
            cause: error,
          },
        )
      }
      const entry: CollectionEntry<T> = {
        id: collection.readId(file),
        file,
        frontmatter,
        readingTime: countReadingTime(document.content),
      }
      return entry
    }),
  )
  const seen = new Map<string, string>()
  for (const entry of entries) {
    const other = seen.get(entry.id)
    if (other) {
      throw new Error(
        `${entry.file}: id "${entry.id}" repeats ${other} in collection "${collection.name}"`,
      )
    }
    seen.set(entry.id, entry.file)
  }
  return entries
}

/** Whether `file`, relative to the collection's root with `/` separators, is in it. */
export function isCollectionFile(collection: Collection<unknown>, file: string) {
  return (
    /\.mdx?$/.test(file) &&
    !file.split("/").includes("node_modules") &&
    collection.include.some(pattern => matchesGlob(file, pattern)) &&
    !collection.exclude.some(pattern => matchesGlob(file, pattern))
  )
}

async function findCollectionFiles<T>(collection: Collection<T>) {
  const files = new Set<string>()
  for (const pattern of collection.include) {
    for await (const match of glob(pattern, {
      cwd: collection.root,
      exclude: path => path.split(sep).includes("node_modules"),
    })) {
      const file = match.split(sep).join("/")
      if (isCollectionFile(collection, file)) files.add(file)
    }
  }
  return [...files].sort()
}

// Code is not read the way prose is, so fenced blocks do not count
function countReadingTime(content: string) {
  const prose = content.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, " ")
  const words = prose.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
