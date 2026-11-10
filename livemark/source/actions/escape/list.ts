import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../../settings.ts"

/** An escapable livemark file and whether the project already shadows it. */
export interface Escape {
  path: string
  escaped: boolean
}

/**
 * List every file a project can shadow under `.livemark/`, from each source tree,
 * sorted by path.
 */
export function listEscapes(props: { root: string; sourceRoots: string[] }) {
  const paths = new Set<string>()
  for (const sourceRoot of props.sourceRoots) {
    for (const folder of ESCAPABLE_FOLDERS) {
      const dir = join(sourceRoot, folder)
      if (!existsSync(dir)) continue
      for (const entry of readdirSync(dir)) {
        if (statSync(join(dir, entry)).isFile()) paths.add(`${folder}/${entry}`)
      }
    }
    for (const file of ESCAPABLE_FILES) {
      if (existsSync(join(sourceRoot, file))) paths.add(file)
    }
  }
  return [...paths].sort().map((path): Escape => ({
    path,
    escaped: existsSync(join(props.root, ".livemark", path)),
  }))
}
