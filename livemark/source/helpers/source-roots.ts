import { createRequire } from "node:module"
import { dirname, join } from "node:path"

/** The source trees a site is assembled from, lowest layer first: @livemark/markdown's
 *  components and pipeline, then livemark's own. No path exists in both. */
export function readSourceRoots(livemarkSourceDir: string) {
  const require = createRequire(import.meta.url)
  const markdownDir = dirname(require.resolve("@livemark/markdown/package.json"))
  return [join(markdownDir, "source"), livemarkSourceDir]
}
