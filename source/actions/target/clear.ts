import { rmSync } from "node:fs"
import { targetDirFor } from "./build.ts"

/**
 * Wipe the per-consumer target dir so the next run rebuilds it from scratch.
 */
export function clearTarget(configPath: string) {
  const targetDir = targetDirFor(configPath)
  rmSync(targetDir, { recursive: true, force: true })
  return targetDir
}
