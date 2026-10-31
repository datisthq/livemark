import { join } from "node:path"
import { autocompleteMultiselect, cancel, isCancel } from "@clack/prompts"
import { f } from "fireargs"
import { helpConfiguration } from "../helpers/program.ts"
import pc from "picocolors"
import { z } from "zod"
import { copyEscape } from "../actions/escape/copy.ts"
import { listEscapes } from "../actions/escape/list.ts"

const sourceRoot = join(import.meta.dirname, "..", "..", "source")

const escapeFile = z.object({
  path: z.string().describe("Path relative to .livemark/"),
  escaped: z.boolean().describe("Whether .livemark/ now holds this file"),
  error: z.string().optional().describe("Why the copy failed"),
})

/**
 * Pick, list or copy escapable livemark files into `.livemark/`.
 *
 * Without an argument, opens a searchable picker in a terminal and lists every
 * file you can shadow otherwise (or with `--list`). With paths, copies each
 * default from the livemark package into `.livemark/<path>`; fails if a
 * destination already exists.
 */
export const escape = f
  .command({
    description: "Pick, list or copy escapable livemark files into .livemark/",
    configureHelp: helpConfiguration,
  })
  .input(
    z.object({
      paths: f
        .argument()
        .schema(z.array(z.string()).default([]))
        .describe(
          "Paths relative to .livemark/ (e.g. components/Footer.tsx, client.tsx)",
        ),
      list: f
        .option({ short: "l" })
        .schema(z.boolean().default(false))
        .describe("List every escapable file instead of opening the picker"),
    }),
  )
  .output(
    z.object({
      action: z.enum(["list", "copy"]).describe("Whether files were listed or copied"),
      files: z.array(escapeFile),
    }),
  )
  .render(output => {
    if (output.action === "copy") return renderCopies(output.files)
    return [
      ...output.files.map(file => file.path),
      pc.dim("\nRun 'livemark escape <path>' to copy a file into .livemark/"),
    ].join("\n")
  })
  .handler(async (input, context) => {
    const root = process.cwd()
    if (input.paths.length)
      return { action: "copy" as const, files: copyPaths(root, input.paths) }

    const escapes = listEscapes({ root, sourceRoot })
    if (context.json || input.list || !process.stdin.isTTY || !process.stdout.isTTY) {
      return { action: "list" as const, files: escapes }
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
    if (isCancel(selected)) {
      cancel("Nothing copied")
      return { action: "copy" as const, files: [] }
    }
    return { action: "copy" as const, files: copyPaths(root, selected) }
  })

function copyPaths(root: string, paths: string[]) {
  return paths.map(path => {
    try {
      copyEscape({ root, sourceRoot, path })
      return { path, escaped: true }
    } catch (error) {
      process.exitCode = 1
      const message = error instanceof Error ? error.message : String(error)
      return { path, escaped: false, error: message }
    }
  })
}

function renderCopies(files: z.infer<typeof escapeFile>[]) {
  for (const file of files) {
    if (file.error) console.error(pc.red(`Error: ${file.error}`))
  }
  return files
    .filter(file => !file.error)
    .map(file => `Copied ${pc.dim(file.path)} → ${pc.green(`.livemark/${file.path}`)}`)
    .join("\n")
}
