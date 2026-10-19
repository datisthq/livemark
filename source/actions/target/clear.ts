import { rmSync } from "node:fs"
import { join } from "node:path"
import { targetDirFor } from "./build.ts"

/**
 * Wipe the project's target dir so the next run rebuilds it from scratch.
 */
export function clearTarget(configPath: string) {
  const targetDir = targetDirFor(configPath)
  // Unlink the dependency link first so the recursive remove cannot reach the store.
  rmSync(join(targetDir, "node_modules"), { force: true })
  rmSync(targetDir, { recursive: true, force: true })
  return targetDir
}
