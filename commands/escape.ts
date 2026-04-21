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
import { OVERRIDE_SUBDIRS } from "../website/plugins/vite-livemark.ts"

const defaultsRoot = join(import.meta.dirname, "..", "website")

/**
 * List or copy overridable livemark files into `.livemark/`.
 *
 * Without an argument, prints every file you can shadow. With a path, copies
 * the default from the livemark package into `.livemark/<path>`; fails if the
 * destination already exists.
 */
export const escape = new Command("escape")
  .description("List or copy overridable livemark files into .livemark/")
  .argument(
    "[path]",
    "path relative to .livemark/ (e.g. components/Footer.tsx)",
  )
  .action((relPath?: string) => {
    if (!relPath) {
      for (const file of listOverridable()) console.log(file)
      console.log(
        pc.dim("\nRun 'livemark escape <path>' to copy a file into .livemark/"),
      )
      return
    }

    const [first] = relPath.split("/")
    if (!first || !OVERRIDE_SUBDIRS.includes(first) || relPath.includes("..")) {
      console.error(
        pc.red(
          `Error: '${relPath}' is not under an overridable subdir (${OVERRIDE_SUBDIRS.join(", ")})`,
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

function listOverridable() {
  const files: string[] = []
  for (const subdir of OVERRIDE_SUBDIRS) {
    const dir = join(defaultsRoot, subdir)
    if (!existsSync(dir)) continue
    for (const entry of readdirSync(dir)) {
      if (statSync(join(dir, entry)).isFile()) files.push(`${subdir}/${entry}`)
    }
  }
  return files.sort()
}
