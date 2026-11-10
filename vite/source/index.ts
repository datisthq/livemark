import { relative, sep } from "node:path"
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
import { createFilter, type Plugin, type ViteDevServer } from "vite"
import type { Collection } from "./actions/collection/define.ts"
import { isCollectionFile } from "./actions/collection/list.ts"
import {
  buildCollectionModuleId,
  renderCollectionModule,
} from "./actions/collection/render.ts"

export {
  defineCollection,
  type Collection,
  type CollectionEntry,
  type CollectionOptions,
  type CollectionSchema,
  type MarkdownModule,
} from "./actions/collection/define.ts"

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
  /** Collections served as `virtual:livemark/collection/<name>`; their files compile
   *  whatever `include` and `exclude` say. */
  collections?: Collection<unknown>[]
}

/** A Vite plugin compiling imported Markdown and MDX with Livemark's pipeline into
 *  modules whose `default` renders with Livemark's components, plus `frontmatter` and
 *  `toc`. A `.mdx` file, or one whose frontmatter sets `format: mdx`, is MDX. */
export function markdown(options: MarkdownPluginOptions = {}): Plugin {
  const collections = options.collections ?? []
  const names = new Set<string>()
  for (const collection of collections) {
    if (names.has(collection.name)) {
      throw new Error(`collection name "${collection.name}" is used twice`)
    }
    names.add(collection.name)
  }
  const include = options.include ?? /\.mdx?$/
  // A collection's files compile even when `include` leaves them out, so with
  // collections the hook takes every Markdown id and the handler decides
  const isIncluded = createFilter(include, options.exclude)
  const rendered = new Map<string, string>()
  const renderModule = async (collection: Collection<unknown>) => {
    const code = renderCollectionModule({ collection, entries: await collection.list() })
    rendered.set(collection.name, code)
    return code
  }
  return {
    name: "livemark:markdown",
    enforce: "pre",
    // Its components ship as TypeScript, which Node cannot run from node_modules
    config: () => ({ ssr: { noExternal: [MARKDOWN_PACKAGE] } }),
    // The emitted modules import @livemark/markdown, a dependency of this package that
    // an app under pnpm cannot resolve itself
    resolveId: {
      filter: { id: /^(@livemark\/markdown\/|virtual:livemark\/collection\/)/ },
      handler(id) {
        if (id.startsWith(COLLECTION_PREFIX)) {
          return names.has(id.slice(COLLECTION_PREFIX.length)) ? `\0${id}` : null
        }
        return this.resolve(id, PLUGIN_FILE, { skipSelf: true })
      },
    },
    load: {
      filter: { id: /^\0virtual:livemark\/collection\// },
      handler(id) {
        const name = id.slice(COLLECTION_PREFIX.length + 1)
        const collection = collections.find(c => c.name === name)
        return collection ? renderModule(collection) : null
      },
    },
    configureServer(server) {
      if (collections.length === 0) return
      server.watcher.on("all", (event, path) => {
        const changed = collections.filter(c => isInCollection(c, path))
        if (changed.length === 0) return
        void refreshCollections({ server, changed, event, rendered, renderModule })
      })
    },
    transform: {
      filter: {
        id: collections.length > 0 ? /\.mdx?$/ : { include, exclude: options.exclude },
      },
      async handler(source, id) {
        if (
          collections.length > 0 &&
          !isIncluded(id) &&
          !collections.some(c => isInCollection(c, id))
        ) {
          return null
        }
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
const COLLECTION_PREFIX = buildCollectionModuleId("")
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

function isInCollection(collection: Collection<unknown>, id: string) {
  const file = relative(collection.root, id.split("?")[0] ?? id)
    .split(sep)
    .join("/")
  return !file.startsWith("../") && isCollectionFile(collection, file)
}

// An edit reloads the page only when it changes a collection's listing; a body-only
// edit is left to the module's own update
async function refreshCollections(props: {
  server: ViteDevServer
  changed: Collection<unknown>[]
  event: string
  rendered: Map<string, string>
  renderModule: (collection: Collection<unknown>) => Promise<string>
}) {
  let reload = false
  for (const collection of props.changed) {
    const previous = props.rendered.get(collection.name)
    if (previous === undefined) continue
    try {
      const code = await props.renderModule(collection)
      if (props.event === "change" && code === previous) continue
    } catch (error) {
      props.rendered.delete(collection.name)
      props.server.config.logger.error(String(error))
    }
    const id = `\0${buildCollectionModuleId(collection.name)}`
    for (const environment of Object.values(props.server.environments)) {
      const module = environment.moduleGraph.getModuleById(id)
      if (module) environment.moduleGraph.invalidateModule(module)
    }
    reload = true
  }
  if (reload) props.server.environments.client.hot.send({ type: "full-reload" })
}
