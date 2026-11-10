import { fileURLToPath } from "node:url"
import {
  compileMarkdown,
  detectMarkdownFormat,
} from "@livemark/markdown/actions/markdown/compile.ts"
import { DIRECTIVE_NAMES } from "@livemark/markdown/actions/processor/create.ts"
import { findContentWarnings } from "@livemark/markdown/helpers/content-warnings.ts"
import { parseFrontmatter } from "@livemark/markdown/helpers/frontmatter.ts"
import type { MarkdownPlugins } from "@livemark/markdown/models/plugins.ts"
import type { CodeThemeDark, CodeThemeLight } from "@livemark/markdown/models/theme.ts"
import type { Plugin } from "vite"

type IdPattern = string | RegExp

/** Options of the `markdown` Vite plugin. */
export interface MarkdownPluginOptions {
  /** The module ids compiled, as globs or patterns; `.md` and `.mdx` files when unset. */
  include?: IdPattern | IdPattern[]
  /** The module ids left alone, as globs or patterns. */
  exclude?: IdPattern | IdPattern[]
  /** The Shiki theme of code in light mode; Livemark's default when unset. */
  codeThemeLight?: CodeThemeLight
  /** The Shiki theme of code in dark mode; Livemark's default when unset. */
  codeThemeDark?: CodeThemeDark
  /** Plugins on the Markdown (`md`) and HTML (`html`) trees, as in a Livemark config. */
  plugins?: MarkdownPlugins
  /** Keep raw HTML and allow MDX; `false` drops raw HTML and refuses MDX. @default true */
  allowDangerousHtml?: boolean
  /** The directory image URLs count from; images keep their URLs when unset. */
  root?: string
  /** The URL the app is served at, put before every root-relative image URL. */
  base?: string
}

/** A Vite plugin compiling imported Markdown and MDX with Livemark's pipeline into
 *  modules whose `default` renders with Livemark's components, plus `frontmatter` and
 *  `toc`. A `.mdx` file, or one whose frontmatter sets `format: mdx`, is MDX. */
export function markdown(options: MarkdownPluginOptions = {}): Plugin {
  return {
    name: "livemark:markdown",
    enforce: "pre",
    // Its components ship as TypeScript, which Node cannot run from node_modules
    config: () => ({ ssr: { noExternal: [MARKDOWN_PACKAGE] } }),
    // The emitted modules import @livemark/markdown, a dependency of this package that
    // an app under pnpm cannot resolve itself
    resolveId: {
      filter: { id: /^@livemark\/markdown\// },
      handler(id) {
        return this.resolve(id, PLUGIN_FILE, { skipSelf: true })
      },
    },
    transform: {
      filter: { id: { include: options.include ?? /\.mdx?$/, exclude: options.exclude } },
      async handler(source, id) {
        const document = parseFrontmatter(source)
        const directives = DIRECTIVE_NAMES
        for (const warning of findContentWarnings({
          text: source,
          filePath: id,
          directives,
        })) {
          this.warn(`${id}: ${warning}`)
        }
        const compiled = await compileMarkdown({
          content: document.content,
          filePath: id,
          format: detectMarkdownFormat({
            filePath: id,
            format: Reflect.get(document.data, "format"),
          }),
          outputFormat: "program",
          options,
        })
        return {
          code: wrapContent({ ...compiled, frontmatter: document.data }),
          map: null,
        }
      },
    },
  }
}

export default markdown

const MARKDOWN_PACKAGE = "@livemark/markdown"
const MARKDOWN_MODULE = `${MARKDOWN_PACKAGE}/components/Markdown`
const PLUGIN_FILE = fileURLToPath(import.meta.url)
const CONTENT_EXPORT = "export default function MDXContent("

// The default export renders through <Markdown>, which supplies Livemark's components
// and the outline `:::toc` reads; MDX's own content function becomes its `component`
function wrapContent(props: { code: string; toc: unknown; frontmatter: object }) {
  if (!props.code.includes(CONTENT_EXPORT)) throw new Error("MDX emitted no MDXContent")
  return [
    props.code.replace(CONTENT_EXPORT, "function MDXContent("),
    'import { jsx as __lmJsx } from "react/jsx-runtime"',
    `import { Markdown as __LmMarkdown } from ${JSON.stringify(MARKDOWN_MODULE)}`,
    `export const frontmatter = ${JSON.stringify(props.frontmatter)}`,
    `export const toc = ${JSON.stringify(props.toc)}`,
    "export default function MarkdownContent(props = {}) {",
    "  return __lmJsx(__LmMarkdown, { component: MDXContent, toc, components: props.components })",
    "}",
  ].join("\n")
}
