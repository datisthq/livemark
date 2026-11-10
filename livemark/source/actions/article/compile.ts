import type { Config } from "../../models/config.ts"
import {
  compileMarkdown,
  type MarkdownOptions,
} from "@livemark/markdown/actions/markdown/compile.ts"

/** Compile an article body with textlane into an MDX function body and its table of
 *  contents, as plain Markdown or as MDX: `format` wins, else a `.mdx` file is MDX. */
export async function compileArticle(props: {
  content: string
  filePath: string
  format?: "md" | "mdx"
  config: Config
}) {
  const format = props.format ?? (props.filePath.endsWith(".mdx") ? "mdx" : "md")
  const compiled = await compileMarkdown({
    content: props.content,
    filePath: props.filePath,
    format,
    outputFormat: "function-body",
    options: readOptions(props.config),
  })
  return { mdx: compiled.code, tocItems: compiled.toc }
}

// One options object per config keeps compileMarkdown's processors cached across
// articles: a dev restart reloads the config in this same process
const options = new WeakMap<Config, MarkdownOptions>()

function readOptions(config: Config) {
  let found = options.get(config)
  if (!found) {
    found = {
      codeThemeLight: config.codeThemeLight,
      codeThemeDark: config.codeThemeDark,
      plugins: config.plugins,
      allowDangerousHtml: config.allowDangerousHtml,
      root: config.root,
      base: config.base,
    }
    options.set(config, found)
  }
  return found
}
