import { join } from "node:path"
import { autocompleteMultiselect, cancel, isCancel } from "@clack/prompts"
import { Command } from "commander"
import pc from "picocolors"
import { copyEscape } from "../actions/escape/copy.ts"
import { listEscapes } from "../actions/escape/list.ts"

const sourceRoot = join(import.meta.dirname, "..", "..", "source")

/**
 * Pick, list or copy escapable livemark files into `.livemark/`.
 *
 * Without an argument, opens a searchable picker in a terminal and prints every
 * file you can shadow otherwise (or with `--list`). With paths, copies each
 * default from the livemark package into `.livemark/<path>`; fails if a
 * destination already exists.
 */
export const escape = new Command("escape")
  .description("Pick, list or copy escapable livemark files into .livemark/")
  .argument(
    "[paths...]",
    "paths relative to .livemark/ (e.g. components/Footer.tsx, client.tsx)",
  )
  .option("-l, --list", "print every escapable file instead of opening the picker")
  .action(async (paths: string[], options: { list?: boolean }) => {
    const root = process.cwd()
    if (paths.length) return copyPaths(root, paths)

    const escapes = listEscapes({ root, sourceRoot })
    if (options.list || !process.stdin.isTTY || !process.stdout.isTTY) {
      for (const escape of escapes) console.log(escape.path)
      console.log(pc.dim("\nRun 'livemark escape <path>' to copy a file into .livemark/"))
      return
    }

    const selected = await autocompleteMultiselect({
      message: "Select files to escape into .livemark/",
      placeholder: "Type to search...",
      options: escapes.map(escape => ({
        value: escape.path,
        label: escape.path,
        hint: escape.escaped ? "already escaped" : undefined,
        disabled: escape.escaped,
      })),
      required: false,
    })
    if (isCancel(selected)) return cancel("Nothing copied")
    copyPaths(root, selected)
  })

function copyPaths(root: string, paths: string[]) {
  for (const path of paths) {
    try {
      copyEscape({ root, sourceRoot, path })
      console.log(`Copied ${pc.dim(path)} → ${pc.green(`.livemark/${path}`)}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(pc.red(`Error: ${message}`))
      process.exitCode = 1
    }
  }
}
