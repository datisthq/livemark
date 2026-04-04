import { relative, resolve } from "node:path"
import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeShiki from "@shikijs/rehype"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import remarkDirective from "remark-directive"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { z } from "zod"
import { loadConfig } from "../actions/config/load.ts"
import { pickDefaultIcon } from "./helpers/article-icon.ts"
import remarkCustomHeadingId from "./helpers/remark-custom-heading-id.ts"
import { remarkCallout } from "./helpers/remark-callout.ts"
import { remarkGithubCallout } from "./helpers/remark-github-callout.ts"
import { remarkNpm } from "./helpers/remark-npm.ts"
import { transformerLineHighlight } from "./helpers/shiki-line-highlight.ts"
import { transformerIcon } from "./helpers/shiki-icon.ts"
import { extractToc } from "./helpers/toc.ts"

const config = await loadConfig()

// content-collections compiles this file to .content-collections/cache/;
// going up 2 levels reconstructs the baseDirectory it uses for path resolution
const baseDir = resolve(import.meta.dirname, "../..")
const directory = relative(baseDir, config.root) || "."

const articles = defineCollection({
  name: "articles",
  directory,
  include: config.articles.include,
  exclude: config.articles.exclude,
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
  }),
  transform: async (document, context) => {
    const icon = document.icon ?? pickDefaultIcon(document._meta.path)
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        remarkDirective,
        remarkCallout,
        remarkGithubCallout,
        remarkNpm,
        remarkCustomHeadingId,
      ],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: { light: "catppuccin-latte", dark: "catppuccin-mocha" },
            transformers: [transformerIcon(), transformerLineHighlight()],
            parseMetaString: (meta: string) => ({ "data-meta": meta }),
          },
        ],
        rehypeSlug,
        rehypeKatex,
      ],
    })
    const toc = extractToc(document.content)
    return { ...document, icon, toc, mdx }
  },
})

export default defineConfig({
  // @ts-expect-error tsgo picks wrong overload when rehype-slug augments unified types
  content: [articles],
})
