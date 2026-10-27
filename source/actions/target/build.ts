import {
  cpSync,
  existsSync,
  mkdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import { basename, dirname, join, relative, resolve } from "node:path"
import { resolveDependencyDir } from "../../helpers/dependency-dir.ts"
import { removeTargetDir } from "../../helpers/target-dir.ts"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../../settings.ts"

/**
 * Synthesize the project's Vite mount — `.livemark/.serve/` for the dev server,
 * `.livemark/.build/` for a production build or preview: livemark's `source/` with the
 * project's `.livemark/` escapes copied over it, plus a `node_modules` link to livemark's
 * dependencies. Escapable folders are rebuilt on every run, so a removed escape never
 * keeps rendering. Returns the target dir.
 */
export function buildTarget(props: {
  configPath: string
  sourceDir: string
  command?: TargetCommand
}) {
  const targetDir = targetDirFor(props.configPath, props.command)
  const overridesRoot = dirname(targetDir)
  // `.target/` was the mount before `.serve/` and `.build/`; an upgrade must not keep it.
  removeTargetDir(join(overridesRoot, ".target"))
  mkdirSync(targetDir, { recursive: true })
  writeFileSync(join(targetDir, ".gitignore"), "*\n")
  // Under a `"type": "commonjs"` project Node would load content-collections' `.js`
  // output as CommonJS, and Vite would name the server bundle `server.mjs`.
  writeFileSync(join(targetDir, "package.json"), ESM_PACKAGE_JSON)

  cpSync(props.sourceDir, targetDir, {
    recursive: true,
    filter: src => isPackageFile(src) && !isEscapableFolder(src, props.sourceDir),
  })
  for (const folder of ESCAPABLE_FOLDERS) {
    const dest = join(targetDir, folder)
    rmSync(dest, { recursive: true, force: true })
    const source = join(props.sourceDir, folder)
    if (existsSync(source))
      cpSync(source, dest, { recursive: true, filter: isPackageFile })
    const overlay = join(overridesRoot, folder)
    if (existsSync(overlay)) cpSync(overlay, dest, { recursive: true })
  }
  for (const file of ESCAPABLE_FILES) {
    const overlay = join(overridesRoot, file)
    if (existsSync(overlay)) cpSync(overlay, join(targetDir, file))
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

function isPackageFile(src: string) {
  return !/\.unit\.tsx?$/.test(src) && basename(src) !== "fixtures"
}

function isEscapableFolder(src: string, sourceDir: string) {
  return ESCAPABLE_FOLDERS.includes(relative(sourceDir, src))
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
