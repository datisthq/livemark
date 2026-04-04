import { relative, resolve } from "node:path"
import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeShiki from "@shikijs/rehype"
import rehypeKatex from "rehype-katex"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { z } from "zod"
import { loadConfig } from "../actions/config/load.ts"

const config = await loadConfig()

// content-collections compiles this file to .content-collections/cache/;
// going up 2 levels reconstructs the baseDirectory it uses for path resolution
const baseDir = resolve(import.meta.dirname, "../..")
const directory = relative(baseDir, config.root) || "."

const articles = defineCollection({
  name: "articles",
  directory,
  include: config.docs.include,
  exclude: config.docs.exclude,
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        [
          rehypeShiki,
          { themes: { light: "github-light", dark: "github-dark" } },
        ],
        rehypeKatex,
        rehypeSanitize,
      ],
    })
    return { ...document, mdx }
  },
})

export default defineConfig({
  content: [articles],
})
