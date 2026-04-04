import type { Heading, Root } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

const STEP_PATTERN = /\s*\[step\]\s*$/

/** Walk a mdast tree, strip `[step]` suffixes from headings, and add a `data-step` attribute */
export function transformStepHeadings(tree: Root) {
  let stepNumber = 0

  visit(tree, "heading", (node: Heading) => {
    const lastChild = node.children[node.children.length - 1]
    if (!lastChild || lastChild.type !== "text") return
    if (!STEP_PATTERN.test(lastChild.value)) return

    stepNumber += 1
    lastChild.value = lastChild.value.replace(STEP_PATTERN, "")

    if (lastChild.value === "" && node.children.length > 1) {
      node.children.pop()
    }

    node.data = node.data ?? {}
    node.data.hProperties = {
      ...node.data.hProperties,
      "data-step": stepNumber,
    }
  })
}

/** Remark plugin that converts `[step]` heading suffixes into numbered step markers */
export const remarkSteps: Plugin<[], Root> = () => {
  return tree => {
    transformStepHeadings(tree)
  }
}
