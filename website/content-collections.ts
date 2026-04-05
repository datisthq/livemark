import { relative, resolve } from "node:path"
import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeShiki from "@shikijs/rehype"
import { transformerTwoslash } from "@shikijs/twoslash"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import remarkDefinitionList from "remark-definition-list"
import remarkDirective from "remark-directive"
import remarkGemoji from "remark-gemoji"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { z } from "zod"
import { loadConfig } from "../actions/config/load.ts"
import { pickDefaultIcon } from "./helpers/article-icon.ts"
import remarkCustomHeadingId from "./plugins/remark-custom-heading-id.ts"
import { remarkCallout } from "./plugins/remark-callout.ts"
import { remarkCard } from "./plugins/remark-card.ts"
import { remarkColumns } from "./plugins/remark-columns.ts"
import { remarkTab } from "./plugins/remark-tab.ts"
import { remarkBadge } from "./plugins/remark-badge.ts"
import { remarkAbbr } from "./plugins/remark-abbr.ts"
import { remarkDetails } from "./plugins/remark-details.ts"
import { remarkFiletree } from "./plugins/remark-filetree.ts"
import { remarkIcon } from "./plugins/remark-icon.ts"
import { remarkCodeTabs } from "./plugins/remark-code-tabs.ts"
import { remarkGithubCallout } from "./plugins/remark-github-callout.ts"
import { remarkImage } from "./plugins/remark-image.ts"
import { remarkMedia } from "./plugins/remark-media.ts"
import { remarkMermaid } from "./plugins/remark-mermaid.ts"
import { remarkNpm } from "./plugins/remark-npm.ts"
import { remarkSteps } from "./plugins/remark-steps.ts"
import {
  transformerLineHighlight,
  transformerNotations,
} from "./plugins/shiki-line-highlight.ts"
import { rehypeInlineCode } from "./plugins/rehype-inline-code.ts"
import { transformerIcon } from "./plugins/shiki-icon.ts"
import { resolveIncludes } from "./helpers/resolve-includes.ts"
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
    const filePath = resolve(config.root, document._meta.filePath)
    const content = resolveIncludes(document.content, filePath)
    const title = document.title ?? extractTitle(content, document._meta.path)
    const icon = document.icon ?? pickDefaultIcon(document._meta.path)
    const mdx = await compileMDX(
      context,
      { ...document, content },
      {
        remarkPlugins: [
          remarkGfm,
          remarkGemoji,
          remarkDefinitionList,
          remarkMath,
          remarkDirective,
          remarkCallout,
          remarkCard,
          remarkColumns,
          remarkTab,
          remarkDetails,
          remarkFiletree,
          remarkIcon,
          remarkBadge,
          remarkAbbr,
          remarkGithubCallout,
          [
            remarkImage,
            {
              filePath: resolve(config.root, document._meta.filePath),
              root: config.root,
            },
          ],
          remarkMermaid,
          remarkMedia,
          remarkNpm,
          remarkCodeTabs,
          remarkSteps,
          remarkCustomHeadingId,
        ],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: { light: "catppuccin-latte", dark: "catppuccin-mocha" },
              transformers: [
                transformerTwoslash({ explicitTrigger: true }),
                transformerIcon(),
                transformerNotations(),
                transformerLineHighlight(),
              ],
              parseMetaString: (meta: string) => ({ "data-meta": meta }),
            },
          ],
          rehypeInlineCode,
          rehypeSlug,
          rehypeKatex,
        ],
      },
    )
    const toc = extractToc(content)
    return { ...document, title, icon, toc, mdx }
  },
})

export default defineConfig({
  // @ts-expect-error tsgo picks wrong overload when rehype-slug augments unified types
  content: [articles],
})
