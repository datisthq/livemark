import type { Root } from "mdast"
import type { Plugin } from "unified"
import convert from "npm-to-yarn"

type Manager = "npm" | "pnpm" | "yarn" | "bun"

const managers: Manager[] = ["npm", "pnpm", "yarn", "bun"]

interface MdxJsxAttribute {
  type: "mdxJsxAttribute"
  name: string
  value: string
}

interface MdxJsxFlowElement {
  type: "mdxJsxFlowElement"
  name: string
  attributes: MdxJsxAttribute[]
  children: []
}

// @ts-expect-error tsgo does not resolve npm-to-yarn default export correctly
const convertCommand: (s: string, to: string) => string = convert

/** Remark plugin that converts npm code blocks into PackageTabs components */
export const remarkNpm: Plugin<[], Root> = () => {
  return tree => {
    const children = tree.children
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      if (node?.type !== "code") continue
      if (node.lang !== "npm" && node.lang !== "package-install") continue

      const command = node.value.trim()
      const attributes: MdxJsxAttribute[] = managers.map(pm => ({
        type: "mdxJsxAttribute" as const,
        name: pm,
        value: convertCommand(command, pm),
      }))

      const jsxNode: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: "PackageTabs",
        attributes,
        children: [],
      }

      // @ts-expect-error mdxJsxFlowElement is not in mdast types
      children[i] = jsxNode
    }
  }
}
