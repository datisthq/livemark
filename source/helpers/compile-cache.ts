import { createHash } from "node:crypto"
import { existsSync, globSync, readFileSync } from "node:fs"
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"

const SOURCE_DIR = join(import.meta.dirname, "..")

/** A disk cache of compiled articles under `dir`, keyed by their input plus a salt
 *  that changes with the config, the files it imports and Livemark's own code. */
export function createCompileCache(props: {
  dir: string
  config: { configDependencies?: string[] }
}) {
  // JSON drops functions, so a changed plugin shows only in the files the config imports
  const salt = hashText(
    JSON.stringify(props.config),
    fingerprintFiles(props.config.configDependencies ?? []),
    fingerprintSource(),
  )
  const used = new Set<string>()
  let ready: Promise<unknown> | undefined

  return {
    async read<T>(input: unknown, compute: () => Promise<T>) {
      const key = hashText(salt, JSON.stringify(input))
      used.add(key)
      const file = join(props.dir, `${key}.json`)
      try {
        const cached: T = JSON.parse(await readFile(file, "utf-8"))
        return cached
      } catch {}
      const value = await compute()
      ready ??= mkdir(props.dir, { recursive: true })
      await ready
      await writeFile(file, JSON.stringify(value))
      return value
    },
    /** Delete the entries no `read` since the cache was created asked for. */
    async prune() {
      const files = await readdir(props.dir).catch(() => [])
      const stale = files.filter(file => !used.has(file.replace(/\.json$/, "")))
      await Promise.all(stale.map(file => rm(join(props.dir, file), { force: true })))
    },
  }
}

// A content hash, not mtimes: the target copy rewrites every file's mtime each run
function fingerprintSource() {
  const files = globSync("**/*.ts", {
    cwd: SOURCE_DIR,
    exclude: ["**/node_modules/**", "**/*.unit.ts"],
  }).sort()
  const hash = createHash("sha256")
  for (const file of files) hash.update(file).update(readFileSync(join(SOURCE_DIR, file)))
  return hash.digest("hex")
}

function fingerprintFiles(files: string[]) {
  const hash = createHash("sha256")
  for (const file of [...files].sort()) {
    hash.update(file).update("\0")
    if (existsSync(file)) hash.update(readFileSync(file))
  }
  return hash.digest("hex")
}

function hashText(...parts: string[]) {
  const hash = createHash("sha256")
  for (const part of parts) hash.update(part).update("\0")
  return hash.digest("hex")
}
