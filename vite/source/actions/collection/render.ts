import { resolve } from "node:path"
import type { Collection, CollectionEntry } from "./define.ts"

/** The id of a collection's virtual module, as an app imports it. */
export function buildCollectionModuleId(name: string) {
  return `virtual:livemark/collection/${name}`
}

/** The code of a collection's virtual module: `entries`, and `load(id)` importing an
 *  entry's compiled module, each file its own chunk. */
export function renderCollectionModule<T>(props: {
  collection: Collection<T>
  entries: CollectionEntry<T>[]
}) {
  const loaders = props.entries.map(entry => {
    const path = resolve(props.collection.root, entry.file).replaceAll("\\", "/")
    return `  [${JSON.stringify(entry.id)}, () => import(${JSON.stringify(path)})],`
  })
  const name = props.collection.name
  return [
    `export const entries = ${JSON.stringify(props.entries)}`,
    `const loaders = new Map([\n${loaders.join("\n")}\n])`,
    "export function load(id) {",
    "  const loader = loaders.get(id)",
    `  if (!loader) return Promise.reject(new Error(\`no entry "\${id}" in collection ${name}\`))`,
    "  return loader()",
    "}",
    "",
  ].join("\n")
}
