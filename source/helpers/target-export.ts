import { join } from "node:path"

/**
 * Map a `livemark/<subpath>` import onto the target copy its `exports` entry names, so
 * escapes importing Livemark modules reach other escapes, not the package originals.
 */
export function resolveTargetExport(props: {
  id: string
  targetDir: string
  exports: Record<string, string>
}) {
  const queryIndex = props.id.indexOf("?")
  const specifier = queryIndex === -1 ? props.id : props.id.slice(0, queryIndex)
  const query = queryIndex === -1 ? "" : props.id.slice(queryIndex)
  if (!specifier.startsWith("livemark/")) return undefined

  const subpath = `./${specifier.slice("livemark/".length)}`
  for (const [key, value] of Object.entries(props.exports)) {
    const [prefix, suffix] = key.split("*")
    if (suffix === undefined || !prefix || !value.startsWith("./source/")) continue
    if (!subpath.startsWith(prefix) || !subpath.endsWith(suffix)) continue
    const name = subpath.slice(prefix.length, subpath.length - suffix.length)
    return (
      join(props.targetDir, value.slice("./source/".length).replace("*", name)) + query
    )
  }
  return undefined
}
