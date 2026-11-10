import { flattenToc } from "../../helpers/toc-outline.ts"
import type { MarkdownPlugins } from "../../models/plugins.ts"
import { TWOSLASH_FENCE } from "../../plugins/twoslash.ts"
import { createProcessor } from "../processor/create.ts"

/** How Markdown compiles: the code themes, plugins, raw HTML and image URLs. */
export interface MarkdownOptions {
  codeThemeLight?: string
  codeThemeDark?: string
  plugins?: MarkdownPlugins
  allowDangerousHtml?: boolean
  root?: string
  base?: string
}

/** Internal: compile a Markdown or MDX body (no frontmatter) into code and its outline.
 *  `program` is an ES module, `function-body` the body `new Function` evaluates. */
export async function compileMarkdown(props: {
  content: string
  filePath: string
  format: "md" | "mdx"
  outputFormat: "program" | "function-body"
  options: MarkdownOptions
}) {
  if (props.format === "mdx" && props.options.allowDangerousHtml === false) {
    throw new Error(
      `${props.filePath}: MDX runs code, which allowDangerousHtml: false forbids`,
    )
  }
  const twoslash = TWOSLASH_FENCE.test(props.content)
  const processor = readProcessor(
    props.options,
    props.format,
    props.outputFormat,
    twoslash,
  )
  const file = await processor.process({ value: props.content, path: props.filePath })
  return { code: String(file.value), toc: flattenToc(file.data.toc) }
}

/** A file's format: its frontmatter `format` when set, else `.mdx` is MDX. */
export function detectMarkdownFormat(props: { filePath: string; format?: unknown }) {
  if (props.format === "md" || props.format === "mdx") return props.format
  return props.filePath.endsWith(".mdx") ? "mdx" : "md"
}

// A frozen processor runs any number of files, so each variant is built once per options
const processors = new WeakMap<
  MarkdownOptions,
  Map<string, ReturnType<typeof createProcessor>>
>()

function readProcessor(
  options: MarkdownOptions,
  format: "md" | "mdx",
  outputFormat: "program" | "function-body",
  twoslash: boolean,
) {
  let variants = processors.get(options)
  if (!variants) {
    variants = new Map()
    processors.set(options, variants)
  }
  const key = `${format}:${outputFormat}:${twoslash}`
  let processor = variants.get(key)
  if (!processor) {
    processor = createProcessor({
      format,
      twoslash,
      outputFormat,
      allowDangerousHtml: options.allowDangerousHtml ?? true,
      // Livemark's own defaults in models/config.ts
      codeThemeLight: options.codeThemeLight ?? "catppuccin-latte",
      codeThemeDark: options.codeThemeDark ?? "catppuccin-mocha",
      plugins: options.plugins,
      root: options.root,
      base: options.base,
    })
    variants.set(key, processor)
  }
  return processor
}
