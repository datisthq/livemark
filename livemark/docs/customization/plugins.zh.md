---
description: 把你自己的 Markdown 和 HTML 插件加入每篇文章的编译管线。
icon: puzzle
order: 12
---

# 插件

每篇文章都由 [textlane](https://textlane.dev) 编译。它是一条 Rust 编写的 Markdown 管线，也能运行 JavaScript 插件。`plugins` 选项把你的插件加入其中，分两个位置：

- `md` 作用于 Markdown 树（mdast），remark 风格的插件放在这里
- `html` 作用于 HTML 树（hast），rehype 风格的插件放在这里

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

## 插件可以是什么

每个位置都是一个列表，接受与 textlane 的 `use` 相同的条目：

- **JavaScript 插件**：unified 风格的 attacher，即返回 transformer 的函数，transformer 原地修改树或返回一棵新树。大多数 remark 和 rehype 的转换插件都属于这一类。
- **原生插件**：`textlane/md` 和 `textlane/html` 导出的插件，例如 `html.externalLinks()` 或 `md.shiftHeading()`。它在 Rust 中运行，比 JavaScript 插件更快。
- **带选项的插件**：`[plugin, options]` 二元组。

JavaScript 插件转换的是已经解析好的树，不能新增语法、解析器或编译器。需要新的块级语法时，请使用[指令](/authoring/rich-elements/)，并在 `md` 插件中处理它。

## 各位置的运行时机

```text
解析 → GFM、数学、指令、MDX → md 插件 → 标题 id、组件、路径改写
→ HTML → 语法高亮、KaTeX → html 插件 → 标题 slug、目录 → MDX
```

- `md` 插件在 Livemark 把指令渲染为组件**之前**运行，因此能看到所有指令。Livemark 不认识的指令会原样传给它们；如果插件不处理，它会按源文本显示。
- `html` 插件在语法高亮**之后**、标题 slug 和目录**之前**运行，因此插件新增的标题会获得锚点，并出现在“本页内容”大纲中。

## 编写插件

下面这个 `md` 插件把 `::hello` 指令替换为一个段落：

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

安装 `@types/mdast` 或 `@types/hast` 以获得树的类型；若要为指令节点提供类型，请以 `import type {} from "mdast-util-directive"` 的形式导入一次 `mdast-util-directive`。

## 重新编译

编辑配置文件，或它导入的任何本地文件（如 `plugins/remark-hello.ts`），都会重启开发服务器并重新编译所有文章。从 npm 安装的插件会随文章一起被缓存，因此升级后请删除 `.livemark/.cache/` 以重新编译。
