import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../../settings.ts"

/** An escapable livemark file and whether the project already shadows it. */
export interface Escape {
  path: string
  escaped: boolean
}

/**
 * List every file a project can shadow under `.livemark/`, sorted by path.
 */
export function listEscapes(props: { root: string; sourceRoot: string }) {
  const paths: string[] = []
  for (const folder of ESCAPABLE_FOLDERS) {
    const dir = join(props.sourceRoot, folder)
    if (!existsSync(dir)) continue
    for (const entry of readdirSync(dir)) {
      if (statSync(join(dir, entry)).isFile()) paths.push(`${folder}/${entry}`)
    }
  }
  for (const file of ESCAPABLE_FILES) {
    if (existsSync(join(props.sourceRoot, file))) paths.push(file)
  }
  return paths.sort().map((path): Escape => ({
    path,
    escaped: existsSync(join(props.root, ".livemark", path)),
  }))
}
