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
import { remarkImage } from "./helpers/remark-image.ts"
import { remarkNpm } from "./helpers/remark-npm.ts"
import { remarkSteps } from "./helpers/remark-steps.ts"
import { transformerLineHighlight } from "./helpers/shiki-line-highlight.ts"
import { transformerIcon } from "./helpers/shiki-icon.ts"
import { extractToc } from "./helpers/toc.ts"

const config = await loadConfig()

// content-collections compiles this file to .content-collections/cache/;
// going up 2 levels reconstructs the baseDirectory it uses for path resolution
const baseDir = resolve(import.meta.dirname, "../..")
const directory = relative(baseDir, config.root) || "."

function extractTitle(content: string, path: string) {
  const match = /^#\s+(.+)$/m.exec(content)
  if (match) return match[1]!
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.\w+$/, "") ?? path
  )
}

const articles = defineCollection({
  name: "articles",
  directory,
  include: config.articles.include,
  exclude: config.articles.exclude,
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().optional(),
  }),
  transform: async (document, context) => {
    const title =
      document.title ?? extractTitle(document.content, document._meta.path)
    const icon = document.icon ?? pickDefaultIcon(document._meta.path)
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        remarkDirective,
        remarkCallout,
        remarkGithubCallout,
        [
          remarkImage,
          {
            filePath: resolve(config.root, document._meta.filePath),
            root: config.root,
          },
        ],
        remarkNpm,
        remarkSteps,
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
    return { ...document, title, icon, toc, mdx }
  },
})

export default defineConfig({
  // @ts-expect-error tsgo picks wrong overload when rehype-slug augments unified types
  content: [articles],
})
