import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../../settings.ts"

/**
 * Copy a livemark default into `<root>/.livemark/<path>`.
 *
 * Throws when the path is not escapable, is not a livemark file, or the
 * destination already exists. Returns the destination path.
 */
export function copyEscape(props: { root: string; sourceRoot: string; path: string }) {
  const isTopLevelFile = !props.path.includes("/") && ESCAPABLE_FILES.includes(props.path)
  const [first] = props.path.split("/")
  const isFolderPath =
    !!first && ESCAPABLE_FOLDERS.includes(first) && !props.path.includes("..")
  if (!isTopLevelFile && !isFolderPath) {
    throw new Error(
      `'${props.path}' is not escapable (folders: ${ESCAPABLE_FOLDERS.join(", ")}; files: ${ESCAPABLE_FILES.join(", ")})`,
    )
  }

  const src = join(props.sourceRoot, props.path)
  if (!existsSync(src) || !statSync(src).isFile()) {
    throw new Error(`'${props.path}' is not a livemark file`)
  }

  const dest = join(props.root, ".livemark", props.path)
  if (existsSync(dest)) {
    throw new Error(`.livemark/${props.path} already exists`)
  }

  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, readFileSync(src))
  return dest
}
