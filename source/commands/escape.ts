import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { Command } from "commander"
import pc from "picocolors"
import { ESCAPABLE_FILES, ESCAPABLE_FOLDERS } from "../settings.ts"

const defaultsRoot = join(import.meta.dirname, "..", "..", "source")

/**
 * List or copy escapable livemark files into `.livemark/`.
 *
 * Without an argument, prints every file you can shadow. With a path, copies
 * the default from the livemark package into `.livemark/<path>`; fails if the
 * destination already exists.
 */
export const escape = new Command("escape")
  .description("List or copy escapable livemark files into .livemark/")
  .argument(
    "[path]",
    "path relative to .livemark/ (e.g. components/Footer.tsx, client.tsx)",
  )
  .action((relPath?: string) => {
    if (!relPath) {
      for (const file of listEscapable()) console.log(file)
      console.log(
        pc.dim("\nRun 'livemark escape <path>' to copy a file into .livemark/"),
      )
      return
    }

    const isTopLevelFile =
      !relPath.includes("/") && ESCAPABLE_FILES.includes(relPath)
    const [first] = relPath.split("/")
    const isFolderPath =
      !!first && ESCAPABLE_FOLDERS.includes(first) && !relPath.includes("..")
    if (!isTopLevelFile && !isFolderPath) {
      console.error(
        pc.red(
          `Error: '${relPath}' is not escapable (folders: ${ESCAPABLE_FOLDERS.join(", ")}; files: ${ESCAPABLE_FILES.join(", ")})`,
        ),
      )
      process.exit(1)
    }

    const src = join(defaultsRoot, relPath)
    if (!existsSync(src) || !statSync(src).isFile()) {
      console.error(pc.red(`Error: '${relPath}' is not a livemark file`))
      process.exit(1)
    }

    const dest = join(process.cwd(), ".livemark", relPath)
    if (existsSync(dest)) {
      console.error(pc.red(`Error: .livemark/${relPath} already exists`))
      process.exit(1)
    }

    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, readFileSync(src))
    console.log(
      `Copied ${pc.dim(relPath)} → ${pc.green(`.livemark/${relPath}`)}`,
    )
  })

function listEscapable() {
  const files: string[] = []
  for (const folder of ESCAPABLE_FOLDERS) {
    const dir = join(defaultsRoot, folder)
    if (!existsSync(dir)) continue
    for (const entry of readdirSync(dir)) {
      if (statSync(join(dir, entry)).isFile()) files.push(`${folder}/${entry}`)
    }
  }
  for (const file of ESCAPABLE_FILES) {
    if (existsSync(join(defaultsRoot, file))) files.push(file)
  }
  return files.sort()
}
