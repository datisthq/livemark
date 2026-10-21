import { rmSync } from "node:fs"
import { dirname, join } from "node:path"

export function removeTargetDir(targetDir: string) {
  // Unlink the dependency link first so the recursive remove cannot reach the store.
  rmSync(join(targetDir, "node_modules"), { force: true })
  rmSync(targetDir, { recursive: true, force: true })
}

export function cacheDirFor(configPath: string) {
  return join(dirname(configPath), ".livemark", ".cache")
}
