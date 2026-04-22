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
import { buildChangelog, cacheIncludeGlob } from "../actions/changelog/build.ts"
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
import { rehypeTaskListA11y } from "./plugins/rehype-task-list-a11y.ts"
import { transformerIcon } from "./plugins/shiki-icon.ts"
import { resolveAssetPath } from "./helpers/resolve-asset-path.ts"
import { resolveIncludes } from "./helpers/resolve-includes.ts"
import { extractSearchText } from "./helpers/search-text.ts"
import { extractToc } from "./helpers/toc.ts"

const config = await loadConfig()

const changelogSections =
  config.sections?.filter(s => s.type === "changelog") ?? []
for (const section of changelogSections) {
  await buildChangelog(section, config)
}

const configInclude = Array.isArray(config.include)
  ? config.include
  : [config.include]
const include = changelogSections.length
  ? [...configInclude, cacheIncludeGlob()]
  : configInclude

// content-collections compiles this file to .content-collections/cache/;
// going up 2 levels reconstructs the baseDirectory it uses for path resolution
const baseDir = resolve(import.meta.dirname, "../..")
const directory = relative(baseDir, config.root) || "."

function toPath(filePath: string) {
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
  include,
  exclude: config.exclude,
  schema: Article,
  transform: async (document, context) => {
    const patch = config.patches?.find(p => p.file === document._meta.filePath)
    const doc = patch ? { ...document, ...patch.article } : document
    const filePath = resolve(config.root, doc._meta.filePath)
    const content = resolveIncludes(doc.content, filePath)
    const title = doc.title ?? extractTitle(content, doc._meta.path)
    const icon = doc.icon ?? pickDefaultIcon(doc._meta.path)
    const path = doc.path ?? toPath(doc._meta.filePath)
    const mdx = await compileMDX(
      context,
      { ...doc, content },
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
              filePath: resolve(config.root, doc._meta.filePath),
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
                light: config.codeThemeLight,
                dark: config.codeThemeDark,
              },
              // Darken catppuccin-latte's green (the colour used for strings and
              // some comments) — the theme default #40A02B lands at 3.2:1 on the
              // code-block background, below the WCAG AA 4.5:1 threshold.
              colorReplacements: {
                "catppuccin-latte": {
                  "#40a02b": "#2a7e16",
                },
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
          rehypeTaskListA11y,
        ],
      },
    )
    const tocItems = extractToc(content)
    const searchText = extractSearchText(content)
    const lastUpdated = getLastUpdated(doc._meta.filePath)
    const image = doc.image
      ? resolveAssetPath(doc.image, filePath, config.root)
      : undefined
    return {
      ...doc,
      file: doc._meta.filePath,
      lastUpdated,
      image,
      title,
      icon,
      path,
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
