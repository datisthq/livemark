import { existsSync, readdirSync, realpathSync } from "node:fs"
import { basename, dirname, join } from "node:path"

/**
 * Locate the directory holding livemark's own dependencies, which the project's target
 * links to as its `node_modules`.
 */
export function resolveDependencyDir(sourceDir: string) {
  const packageDir = realpathSync(dirname(sourceDir))
  const parent = dirname(packageDir)
  const nested = join(packageDir, "node_modules")
  // pnpm gives an installed package a `.bin`-only `node_modules`; its deps sit beside it
  // in the store. Only real packages there (a checkout, npm's conflict copies) count.
  if (hasPackages(nested) || basename(parent) !== "node_modules") return nested
  return parent
}

function hasPackages(dir: string) {
  return existsSync(dir) && readdirSync(dir).some(name => !name.startsWith("."))
}
