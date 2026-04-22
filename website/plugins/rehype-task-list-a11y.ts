import { visit } from "unist-util-visit"

interface HastNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

/** Give each GFM task-list checkbox an accessible name so screen readers and
 * axe-based audits don't flag them as form controls without labels. */
export function rehypeTaskListA11y() {
  return (tree: HastNode) => {
    visit(tree, "element", (node: HastNode) => {
      if (node.tagName !== "li") return
      const classes = node.properties?.className
      const hasTaskClass =
        Array.isArray(classes) && classes.includes("task-list-item")
      if (!hasTaskClass) return

      for (const child of node.children ?? []) {
        if (child.type !== "element") continue
        if (child.tagName !== "input") continue
        if (child.properties?.type !== "checkbox") continue
        child.properties = {
          ...child.properties,
          ariaLabel: child.properties?.checked ? "Completed task" : "Task",
        }
        break
      }
    })
  }
}
