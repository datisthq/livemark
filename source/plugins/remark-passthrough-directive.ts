import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive"
import type { Root, Text } from "mdast"
import type { Plugin } from "unified"
import { SKIP, visit } from "unist-util-visit"

type Directive = TextDirective | LeafDirective | ContainerDirective

/** Convert any remaining `:name`, `::name`, `:::name` directive nodes back to
 *  plain text after the directive-handling plugins have run.
 *
 *  `remark-directive` parses anything matching `:[a-zA-Z0-9-]+` as a directive,
 *  including patterns like `3.2:1` or `port:8080` that weren't meant as
 *  directives at all. Without this pass, the leftover nodes render as empty
 *  `<span>`/`<div>` elements (because remark-rehype's default for unknown
 *  directive nodes drops the surrounding text). */
export const remarkPassthroughDirective: Plugin<[], Root> = () => {
  return tree => {
    visit(tree, (node, index, parent) => {
      if (
        index === undefined ||
        !parent ||
        (node.type !== "textDirective" &&
          node.type !== "leafDirective" &&
          node.type !== "containerDirective")
      )
        return
      const directive = node as Directive
      const prefix =
        directive.type === "containerDirective"
          ? ":::"
          : directive.type === "leafDirective"
            ? "::"
            : ":"
      const text: Text = {
        type: "text",
        value: `${prefix}${directive.name}`,
      }
      parent.children.splice(index, 1, text)
      return [SKIP, index + 1]
    })
  }
}
