import { execSync } from "node:child_process"
import { basename, relative, resolve } from "node:path"
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
import { loadConfig } from "../actions/config/load.ts"
import { Article } from "./models/article.ts"
import { pickDefaultIcon } from "./helpers/article-icon.ts"
import slugify from "@sindresorhus/slugify"
import remarkCustomHeadingId from "./plugins/remark-custom-heading-id.ts"
import { remarkCallout } from "./plugins/remark-callout.ts"
import { remarkCard } from "./plugins/remark-card.ts"
import { remarkColumns } from "./plugins/remark-columns.ts"
import { remarkTab } from "./plugins/remark-tab.ts"
import { remarkBadge } from "./plugins/remark-badge.ts"
import { remarkButton } from "./plugins/remark-button.ts"
import { remarkAbbr } from "./plugins/remark-abbr.ts"
import { remarkDeflist } from "./plugins/remark-deflist.ts"
import { remarkDetails } from "./plugins/remark-details.ts"
import { remarkFiletree } from "./plugins/remark-filetree.ts"
import { remarkIcon } from "./plugins/remark-icon.ts"
import { remarkCodeTabs } from "./plugins/remark-code-tabs.ts"
import { remarkGithubCallout } from "./plugins/remark-github-callout.ts"
import { remarkImage } from "./plugins/remark-image.ts"
import { remarkMedia } from "./plugins/remark-media.ts"
import { remarkAnsi } from "./plugins/remark-ansi.ts"
import { remarkMermaid } from "./plugins/remark-mermaid.ts"
import { remarkToc } from "./plugins/remark-toc.ts"
import { remarkNpm } from "./plugins/remark-npm.ts"
import { remarkSteps } from "./plugins/remark-steps.ts"
import {
  transformerLineHighlight,
  transformerNotations,
} from "./plugins/shiki-line-highlight.ts"
import { rehypeInlineCode } from "./plugins/rehype-inline-code.ts"
import { transformerIcon } from "./plugins/shiki-icon.ts"
import { resolveAssetPath } from "./helpers/resolve-asset-path.ts"
import { resolveIncludes } from "./helpers/resolve-includes.ts"
import { extractSearchText } from "./helpers/search-text.ts"
import { extractToc } from "./helpers/toc.ts"

const config = await loadConfig()

// content-collections compiles this file to .content-collections/cache/;
// going up 2 levels reconstructs the baseDirectory it uses for path resolution
const baseDir = resolve(import.meta.dirname, "../..")
const directory = relative(baseDir, config.root) || "."

function toPathname(filePath: string) {
  const name = basename(filePath).replace(/\.\w+$/, "")
  return slugify(name)
}

function getLastUpdated(filePath: string) {
  try {
    const timestamp = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      cwd: config.root,
      encoding: "utf-8",
    }).trim()
    return timestamp || undefined
  } catch {
    return undefined
  }
}

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
  schema: Article,
  transform: async (document, context) => {
    const filePath = resolve(config.root, document._meta.filePath)
    const content = resolveIncludes(document.content, filePath)
    const title = document.title ?? extractTitle(content, document._meta.path)
    const icon = document.icon ?? pickDefaultIcon(document._meta.path)
    const pathname = document.pathname ?? toPathname(document._meta.filePath)
    const mdx = await compileMDX(
      context,
      { ...document, content },
      {
        remarkPlugins: [
          remarkGfm,
          remarkGemoji,
          remarkDefinitionList,
          remarkDeflist,
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
          remarkButton,
          remarkAbbr,
          remarkGithubCallout,
          [
            remarkImage,
            {
              filePath: resolve(config.root, document._meta.filePath),
              root: config.root,
            },
          ],
          remarkAnsi,
          remarkMermaid,
          remarkMedia,
          remarkToc,
          remarkNpm,
          remarkCodeTabs,
          remarkSteps,
          remarkCustomHeadingId,
        ],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: {
                light: config.code?.theme?.light ?? "catppuccin-latte",
                dark: config.code?.theme?.dark ?? "catppuccin-mocha",
              },
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
    const tocItems = extractToc(content)
    const searchText = extractSearchText(content)
    const lastUpdated = getLastUpdated(document._meta.filePath)
    const image = document.image
      ? resolveAssetPath(document.image, filePath, config.root)
      : undefined
    return {
      ...document,
      filePath: document._meta.filePath,
      lastUpdated,
      image,
      title,
      icon,
      pathname,
      tocItems,
      searchText,
      mdx,
    }
  },
})

export default defineConfig({
  // @ts-expect-error tsgo picks wrong overload when rehype-slug augments unified types
  content: [articles],
})
