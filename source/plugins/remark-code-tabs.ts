import type { Code, Root } from "mdast"
import type { Plugin } from "unified"

const TAB_PATTERN = /\btab="([^"]+)"/
const SYNC_PATTERN = /\bsync="([^"]+)"/

/** Remark plugin that groups consecutive code blocks with tab="name" meta into a CodeTabs component */
export const remarkCodeTabs: Plugin<[], Root> = () => {
  return tree => {
    const children = tree.children
    let i = 0

    while (i < children.length) {
      const node = children[i]
      if (node?.type !== "code" || !node.meta) {
        i++
        continue
      }

      const firstMatch = TAB_PATTERN.exec(node.meta)
      if (!firstMatch) {
        i++
        continue
      }

      const group: { name: string; code: Code }[] = [
        { name: firstMatch[1]!, code: node },
      ]

      let j = i + 1
      while (j < children.length) {
        const next = children[j]
        if (next?.type !== "code" || !next.meta) break
        const nextMatch = TAB_PATTERN.exec(next.meta)
        if (!nextMatch) break
        group.push({ name: nextMatch[1]!, code: next })
        j++
      }

      if (group.length < 2) {
        i++
        continue
      }

      const firstMeta = group[0]!.code.meta!
      const syncMatch = SYNC_PATTERN.exec(firstMeta)

      for (const item of group) {
        item.code.meta =
          item.code
            .meta!.replace(TAB_PATTERN, "")
            .replace(SYNC_PATTERN, "")
            .trim() || null
      }

      const codeTabsAttrs: {
        type: "mdxJsxAttribute"
        name: string
        value: string
      }[] = [
        {
          type: "mdxJsxAttribute",
          name: "tabs",
          value: JSON.stringify(group.map(g => g.name)),
        },
      ]
      if (syncMatch) {
        codeTabsAttrs.push({
          type: "mdxJsxAttribute",
          name: "sync",
          value: syncMatch[1]!,
        })
      }

      const jsxNode = {
        type: "mdxJsxFlowElement",
        name: "CodeTabs",
        attributes: codeTabsAttrs,
        children: group.map(g => g.code),
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      children.splice(i, group.length, jsxNode)
      i++
    }
  }
}
