import { writeFile } from "node:fs/promises"
import { join, posix } from "node:path"
import { pathToFileURL } from "node:url"
import type { ComponentType } from "react"
import { temporaryDirectoryTask } from "tempy"
import { markdown, type MarkdownPluginOptions } from "../index.ts"

interface MarkdownModule {
  default: ComponentType<{ components?: object }>
  frontmatter: Record<string, unknown>
  toc: unknown
}

/** Run the plugin's transform on `source` as `name`, and import the module it emits. */
export async function importMarkdown(props: {
  source: string
  name?: string
  options?: MarkdownPluginOptions
}) {
  const result = await transformMarkdown(props)
  return temporaryDirectoryTask(async dir => {
    const file = join(dir, "post.mjs")
    await writeFile(file, pinSpecifiers(result.code))
    const module: MarkdownModule = await import(pathToFileURL(file).href)
    return { ...module, code: result.code, warnings: result.warnings }
  })
}

/** The plugin's transform output for `source` as `name`, with the warnings it raised. */
export async function transformMarkdown(props: {
  source: string
  name?: string
  options?: MarkdownPluginOptions
}) {
  const transform = markdown(props.options).transform
  if (typeof transform !== "object" || transform === null || !("handler" in transform)) {
    throw new Error("the plugin has no transform handler")
  }
  const warnings: string[] = []
  const context = { warn: (message: string) => warnings.push(message) }
  // Vite ids use "/" on every platform
  const id = posix.join("/posts", props.name ?? "post.md")
  const result: unknown = await Reflect.apply(transform.handler, context, [
    props.source,
    id,
  ])
  if (typeof result !== "object" || result === null || !("code" in result)) {
    throw new Error("the transform returned no code")
  }
  return { code: String(result.code), warnings }
}

// A temp file resolves no bare specifier, so each is imported by its resolved URL
function pinSpecifiers(code: string) {
  let pinned = code
  for (const specifier of [
    "react/jsx-runtime",
    "@livemark/markdown/components/Markdown",
  ]) {
    const url = import.meta.resolve(specifier)
    pinned = pinned.replaceAll(JSON.stringify(specifier), JSON.stringify(url))
  }
  return pinned
}
