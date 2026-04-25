import type { Plugin } from "unified"
import { visit } from "unist-util-visit"
import {
  type BundledLanguage,
  bundledLanguages,
  getSingletonHighlighter,
} from "shiki"

interface HastText {
  type: "text"
  value: string
}

type PropertyValue =
  | boolean
  | number
  | string
  | null
  | undefined
  | Array<string | number>

interface HastElement {
  type: "element"
  tagName: string
  properties: Record<string, PropertyValue>
  children: (HastElement | HastText)[]
}

interface HastRoot {
  type: "root"
  children: (HastElement | HastText)[]
}

type HastNode = HastRoot | HastElement | HastText

const LANG_PREFIX = /^\{:(\w+)\}/

function isBundledLanguage(lang: string): lang is BundledLanguage {
  return lang in bundledLanguages
}

/** Rehype plugin that applies Shiki syntax highlighting to inline code spans with a `{:lang}` prefix. */
export const rehypeInlineCode: Plugin<[], HastRoot> = () => {
  return async (tree: HastRoot) => {
    const highlighter = await getSingletonHighlighter({
      themes: ["catppuccin-latte", "catppuccin-mocha"],
      langs: [],
    })

    const nodes: {
      node: HastElement
      lang: BundledLanguage
      code: string
    }[] = []

    visit(
      tree,
      "element",
      (
        node: HastNode,
        _index: number | undefined,
        parent: HastNode | undefined,
      ) => {
        if (node.type !== "element") return
        if (node.tagName !== "code") return
        if (parent && parent.type === "element" && parent.tagName === "pre")
          return

        const textChild = node.children[0]
        if (!textChild || textChild.type !== "text") return

        const match = LANG_PREFIX.exec(textChild.value)
        if (!match) return

        const lang = match[1]!
        if (!isBundledLanguage(lang)) return

        const code = textChild.value.slice(match[0].length)
        nodes.push({ node, lang, code })
      },
    )

    for (const { node, lang, code } of nodes) {
      await highlighter.loadLanguage(lang)
      const result = highlighter.codeToHast(code, {
        themes: { light: "catppuccin-latte", dark: "catppuccin-mocha" },
        lang,
      })

      const pre = result.children[0]
      if (pre && pre.type === "element" && "children" in pre) {
        const codeEl = pre.children[0]
        if (codeEl && codeEl.type === "element" && "children" in codeEl) {
          node.children = codeEl.children.filter(
            (c): c is HastElement | HastText =>
              c.type === "element" || c.type === "text",
          )
          node.properties = {
            ...node.properties,
            className: "shiki-inline",
            style: codeEl.properties?.style,
          }
        }
      }
    }
  }
}
