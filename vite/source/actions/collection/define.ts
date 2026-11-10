import { resolve } from "node:path"
import type { ComponentType } from "react"
import type { TocItem } from "@livemark/markdown/models/toc.ts"
import { listCollection } from "./list.ts"

/** Validates a file's frontmatter; a zod schema, or anything else with `parse`. */
export interface CollectionSchema<T> {
  parse(data: unknown): T
}

/** Options of `defineCollection`. */
export interface CollectionOptions {
  /** Names the virtual module, `virtual:livemark/collection/<name>`. */
  name: string
  /** The `.md` and `.mdx` files in the collection, as globs relative to `root`. */
  include: string | string[]
  /** The files left out, as globs relative to `root`. */
  exclude?: string | string[]
  /** The directory the globs count from; the working directory when unset. */
  root?: string
  /** An entry's id from its file path relative to `root`; the path without its
   *  extension when unset. */
  id?: (file: string) => string
}

/** One file of a collection: its frontmatter and metadata, without its body. */
export interface CollectionEntry<T = Record<string, unknown>> {
  id: string
  /** The path relative to the collection's `root`, with `/` separators. */
  file: string
  frontmatter: T
  /** Minutes to read the body at 200 words a minute, code blocks left out; at least 1. */
  readingTime: number
}

/** What importing a compiled `.md` or `.mdx` file gives, as `load(id)` resolves it. */
export interface MarkdownModule {
  default: ComponentType<{ components?: object }>
  frontmatter: Record<string, unknown>
  toc: TocItem[]
}

/** A set of Markdown files listed without their bodies, from Node or through the
 *  plugin's virtual module, with each body loaded on demand. */
export interface Collection<T = Record<string, unknown>> {
  name: string
  root: string
  include: string[]
  exclude: string[]
  readId: (file: string) => string
  parseFrontmatter: (data: Record<string, unknown>) => T
  /** Every entry, sorted by file; throws on invalid frontmatter or a repeated id. */
  list: () => Promise<CollectionEntry<T>[]>
}

/** Define a collection of Markdown files: pass it to the plugin's `collections` for
 *  its virtual module, or call its `list()` from Node, e.g. to enumerate pages. */
export function defineCollection<T>(
  options: CollectionOptions & { schema: CollectionSchema<T> },
): Collection<T>
export function defineCollection(options: CollectionOptions): Collection
export function defineCollection(
  options: CollectionOptions & { schema?: CollectionSchema<unknown> },
): Collection<unknown> {
  if (!/^[\w-]+$/.test(options.name)) {
    throw new Error(`collection name "${options.name}" must be letters, digits, _ or -`)
  }
  const schema = options.schema
  const collection: Collection<unknown> = {
    name: options.name,
    root: resolve(options.root ?? process.cwd()),
    include: toArray(options.include),
    exclude: toArray(options.exclude),
    readId: options.id ?? (file => file.replace(/\.mdx?$/, "")),
    parseFrontmatter: schema ? data => schema.parse(data) : data => data,
    list: () => listCollection(collection),
  }
  return collection
}

function toArray(value: string | string[] | undefined) {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}
