import { transformerTwoslash } from "@shikijs/twoslash"
import type { Element, ElementContent, Root } from "hast"
import { toString } from "hast-util-to-string"
import { type BundledLanguage, bundledLanguages, getSingletonHighlighter } from "shiki"
import { visit } from "unist-util-visit"
import type { Config } from "../models/config.ts"

const TWOSLASH = /(?:^|\s)twoslash(?:\s|$)/

/** Re-highlight the code blocks whose meta names `twoslash` with Shiki's twoslash
 *  transformer: the one stage textlane cannot run natively, as it needs TypeScript. */
export function twoslashStage(options: { config: Config }) {
  return async (tree: Root) => {
    const blocks: { node: Element; meta: string; lang: string }[] = []
    visit(tree, "element", node => {
      if (node.tagName !== "pre") return
      const meta = node.properties["data-meta"] ?? node.properties.dataMeta
      if (typeof meta !== "string" || !TWOSLASH.test(meta)) return
      blocks.push({ node, meta, lang: readLanguage(node) })
    })
    if (blocks.length === 0) return
    const themes = {
      light: options.config.codeThemeLight,
      dark: options.config.codeThemeDark,
    }
    const highlighter = await getSingletonHighlighter({
      themes: [themes.light, themes.dark],
      langs: [],
    })
    for (const block of blocks) {
      const lang = block.lang in bundledLanguages ? (block.lang as BundledLanguage) : "ts"
      await highlighter.loadLanguage(lang)
      const fragment = highlighter.codeToHast(toString(block.node), {
        lang,
        themes,
        meta: { __raw: block.meta, "data-meta": block.meta },
        transformers: [transformerTwoslash({ explicitTrigger: true })],
      })
      const pre = fragment.children[0]
      if (pre?.type !== "element") continue
      block.node.properties = pre.properties
      block.node.children = pre.children as ElementContent[]
    }
  }
}

// addLanguageClass put `language-<name>` on the block's `<code>`
function readLanguage(pre: Element) {
  const code = pre.children.find(
    (child): child is Element => child.type === "element" && child.tagName === "code",
  )
  const classes = code?.properties.className
  const name = Array.isArray(classes)
    ? classes.find(item => typeof item === "string" && item.startsWith("language-"))
    : undefined
  return typeof name === "string" ? name.slice("language-".length) : "ts"
}
