---
description: Add your own Markdown and HTML plugins to the pipeline every article compiles through.
path: /customization/plugins/
icon: puzzle
order: 12
---

# Plugins

Every article compiles through [textlane](https://textlane.dev), a Rust Markdown pipeline that also runs JavaScript plugins. The `plugins` option adds your own plugins to it, in two slots:

- `md` runs on the Markdown tree (mdast), where remark-style plugins work
- `html` runs on the HTML tree (hast), where rehype-style plugins work

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"
import * as html from "textlane/html"
import { remarkHello } from "./plugins/remark-hello.ts"

export default defineConfig({
  plugins: {
    md: [remarkHello],
    html: [html.externalLinks({ target: "_blank" })],
  },
})
```

## What a plugin can be

Each slot is a list that takes the same entries as textlane's `use`:

- **A JavaScript plugin**: a unified-style attacher, a function that returns a transformer, which changes the tree in place or returns a new one. Most remark and rehype transform plugins fit here.
- **A native plugin**: one of the plugins `textlane/md` and `textlane/html` export, such as `html.externalLinks()` or `md.shiftHeading()`. It runs in Rust, so it's faster than a JavaScript plugin.
- **A plugin with options**: a `[plugin, options]` pair.

A JavaScript plugin transforms a tree that's already been parsed. It can't add new syntax, a parser or a compiler. For new block syntax, use a [directive](/authoring/rich-elements/) and handle it in an `md` plugin.

## Where each slot runs

```text
parse → GFM, math, directives, MDX → md plugins → heading ids, components, path rewrites
→ HTML → syntax highlighting, KaTeX → html plugins → heading slugs, table of contents → MDX
```

- `md` plugins run **before** Livemark renders directives as components, so they see every directive. A directive name Livemark doesn't know reaches them intact. Left alone, it renders as its source text.
- `html` plugins run **after** syntax highlighting and **before** heading slugs and the table of contents, so a heading a plugin adds gets an anchor and appears in the "On this page" outline.

## Writing one

This `md` plugin replaces a `::hello` directive with a paragraph:

```ts title="plugins/remark-hello.ts"
import type { Root } from "mdast"

export function remarkHello() {
  return (tree: Root) => {
    tree.children = tree.children.map(node =>
      node.type === "leafDirective" && node.name === "hello"
        ? { type: "paragraph", children: [{ type: "text", value: "Hello!" }] }
        : node,
    )
  }
}
```

Install `@types/mdast` or `@types/hast` for the tree types, and import `mdast-util-directive` once, as `import type {} from "mdast-util-directive"`, to type directive nodes.

## Rebuilds

Editing the config, or any local file it imports, such as `plugins/remark-hello.ts`, restarts the dev server and recompiles every article. A plugin installed from npm is cached with your articles, so after upgrading it, delete `.livemark/.cache/` to recompile.
