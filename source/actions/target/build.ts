import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"
import { resolveDependencyDir } from "../../helpers/dependency-dir.ts"
import { removeTargetDir } from "../../helpers/target-dir.ts"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../../settings.ts"

/**
 * Synthesize the project's Vite mount — `.livemark/.serve/` for the dev server,
 * `.livemark/.build/` for a production build or preview: livemark's `source/` with the
 * project's `.livemark/` escapes copied over it, plus a `node_modules` link to livemark's
 * dependencies. Escapable folders are synced on every run, so a removed escape never
 * keeps rendering. Returns the target dir.
 */
export function buildTarget(props: {
  configPath: string
  sourceDir: string
  command?: TargetCommand
}) {
  const targetDir = targetDirFor(props.configPath, props.command)
  const overridesRoot = dirname(targetDir)
  // `.target/` was the mount before `.serve/` and `.build/`; an upgrade must not keep it,
  // nor the output content-collections left in the mount, which Tailwind would scan.
  removeTargetDir(join(overridesRoot, ".target"))
  rmSync(join(targetDir, ".content-collections"), { recursive: true, force: true })
  mkdirSync(targetDir, { recursive: true })
  writeIfChanged(join(targetDir, ".gitignore"), "*\n")
  // Under a `"type": "commonjs"` project Vite would name the server bundle `server.mjs`.
  writeIfChanged(join(targetDir, "package.json"), ESM_PACKAGE_JSON)

  // Only changed bytes are written: a rewrite of every file on a dev-server restart
  // sends the browser a reload into the server that is shutting down.
  const plan = new Map<string, string>()
  for (const file of listFiles(props.sourceDir)) {
    if (isPackageFile(file)) plan.set(file, join(props.sourceDir, file))
  }
  for (const folder of ESCAPABLE_FOLDERS) {
    const overlay = join(overridesRoot, folder)
    for (const file of listFiles(overlay))
      plan.set(join(folder, file), join(overlay, file))
  }
  for (const file of ESCAPABLE_FILES) {
    const overlay = join(overridesRoot, file)
    if (existsSync(overlay)) plan.set(file, overlay)
  }
  for (const [file, source] of plan) copyIfChanged(source, join(targetDir, file))
  for (const folder of ESCAPABLE_FOLDERS) {
    for (const file of listFiles(join(targetDir, folder))) {
      if (!plan.has(join(folder, file))) rmSync(join(targetDir, folder, file))
    }
  }

  linkDependencies(targetDir, resolveDependencyDir(props.sourceDir))
  return targetDir
}

/** A `package.json` marking the files beside it as ES modules. */
export const ESM_PACKAGE_JSON = '{ "type": "module" }\n'

/** Which mount a run uses: the dev server's, or the production build's. */
export type TargetCommand = "serve" | "build"

/** Locate the project's target dir without building it. */
export function targetDirFor(configPath: string, command: TargetCommand = "serve") {
  return join(dirname(configPath), ".livemark", `.${command}`)
}

function isPackageFile(file: string) {
  return !/\.unit\.tsx?$/.test(file) && !file.split(sep).includes("fixtures")
}

function listFiles(dir: string) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => relative(dir, join(entry.parentPath, entry.name)))
}

function copyIfChanged(source: string, dest: string) {
  if (existsSync(dest) && readFileSync(dest).equals(readFileSync(source))) return
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(source, dest)
}

function writeIfChanged(path: string, content: string) {
  if (existsSync(path) && readFileSync(path, "utf-8") === content) return
  writeFileSync(path, content)
}

function linkDependencies(targetDir: string, dependencyDir: string) {
  const link = join(targetDir, "node_modules")
  if (readLink(link) === resolve(dependencyDir)) return
  // Not recursive: a stale link must go without touching the store it points into.
  rmSync(link, { force: true })
  symlinkSync(dependencyDir, link, "junction")
}

function readLink(path: string) {
  try {
    return resolve(dirname(path), readlinkSync(path))
  } catch {
    return undefined
  }
}
