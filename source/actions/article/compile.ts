import type { Context, Meta } from "@content-collections/core"
import { bundleMDX } from "mdx-bundler"
import rehypeRaw from "rehype-raw"
import type { Pluggable } from "unified"

/** Compile an article body to a bundled MDX component, as plain Markdown or as MDX:
 *  `format` wins, else a `.mdx` file is MDX and anything else is Markdown. */
export async function compileArticle(
  context: Pick<Context, "cache">,
  document: { _meta: Meta; content: string },
  options: {
    format?: "md" | "mdx"
    remarkPlugins: Pluggable[]
    rehypePlugins: Pluggable[]
  },
) {
  const format =
    options.format ?? (document._meta.filePath.endsWith(".mdx") ? "mdx" : "md")
  const key = { content: document.content, _meta: document._meta, format }
  return context.cache(
    key,
    async () => {
      const { code } = await bundleMDX({
        source: document.content,
        mdxOptions: mdxOptions => {
          mdxOptions.format = format
          // mdx-bundler names its entry `.mdx`; without this the `md` processor skips it
          mdxOptions.mdExtensions = [".mdx"]
          mdxOptions.remarkPlugins = options.remarkPlugins
          mdxOptions.rehypePlugins =
            format === "md"
              ? [[rehypeRaw, { passThrough: MDX_NODE_TYPES }], ...options.rehypePlugins]
              : options.rehypePlugins
          return mdxOptions
        },
      })
      return code
    },
    { key: "__article" },
  )
}

// Remark plugins emit MDX JSX nodes, which rehype-raw throws on unless passed through
const MDX_NODE_TYPES = [
  "mdxFlowExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "mdxjsEsm",
]
