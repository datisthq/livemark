import { cacheDirFor, removeTargetDir } from "../../helpers/target-dir.ts"
import { targetDirFor } from "./build.ts"

/**
 * Wipe the project's target dirs and cache so the next run rebuilds them from scratch.
 */
export function clearTarget(configPath: string) {
  const targetDirs = [
    targetDirFor(configPath, "serve"),
    targetDirFor(configPath, "build"),
    cacheDirFor(configPath),
  ]
  for (const targetDir of targetDirs) removeTargetDir(targetDir)
  return targetDirs
}
