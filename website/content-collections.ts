import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeShiki from "@shikijs/rehype"
import rehypeKatex from "rehype-katex"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { z } from "zod"

const docs = defineCollection({
  name: "docs",
  directory: "docs",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        [rehypeShiki, { themes: { light: "github-light", dark: "github-dark" } }],
        rehypeKatex,
        rehypeSanitize,
      ],
    })
    return { ...document, mdx }
  },
})

export default defineConfig({
  content: [docs],
})
