---
description: 在你自己的 Vite + React 应用中，用 Livemark 的管线和组件渲染 Markdown。
label: Vite 插件
icon: package
order: 7
---

# Markdown Vite 插件

Livemark 的 Markdown 管线和文章组件单独发布为 `@livemark/vite`。任何基于 Vite 的 React 应用无需安装 Livemark，就能导入 `.md` 和 `.mdx` 文件，并用与 Livemark 文章相同的提示块、标签页、代码块和卡片来渲染它们。

```bash
npm install @livemark/vite
```

## Vite 插件

```ts title="vite.config.ts"
import markdown from "@livemark/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [markdown()],
})
```

每个被导入的 `.md` 或 `.mdx` 文件都会变成一个模块，导出：

- `default`：内容本身，一个用 Livemark 组件渲染的 React 组件
- `frontmatter`：文件的 YAML frontmatter
- `toc`：其 h2 到 h4 标题，形如 `{ url, title, depth }`

文件的编译方式与 Livemark 编译文章相同：`.md` 按 Markdown，`.mdx` 按 MDX；frontmatter 中的 `format: md` 或 `format: mdx` 优先于扩展名。

| 选项                 | 默认值             | 作用                                                             |
| -------------------- | ------------------ | ---------------------------------------------------------------- |
| `include`            | `/\.mdx?$/`        | 要编译的模块 id，glob 或正则表达式                               |
| `exclude`            |                    | 不处理的模块 id                                                  |
| `codeThemeLight`     | `catppuccin-latte` | 浅色模式下的[语法主题](/zh/customization/syntax-themes/)         |
| `codeThemeDark`      | `catppuccin-mocha` | 深色模式下的语法主题                                             |
| `plugins`            |                    | `{ md, html }` [插件](/zh/customization/plugins/)，与站点相同    |
| `allowDangerousHtml` | `true`             | `false` 会丢弃所有原始 HTML，并在任何本应按 MDX 编译的文件上报错 |
| `root`、`base`       |                    | 从 `root` 解析相对图片 URL，并在 `base` 下提供                   |
| `collections`        |                    | 作为虚拟模块提供的集合                                           |

对于你不完全信任的内容，请设置 `allowDangerousHtml: false`：Markdown 不能运行代码，而 MDX 可以。带 `javascript:` URL 的链接在渲染时会被 React 拦截。插件还会通过 Vite 对静默渲染出错的内容发出警告，例如未知指令。

在 TypeScript 中，引用一次模块类型：

```ts title="env.d.ts"
/// <reference types="@livemark/vite/env" />
```

## 渲染

```tsx title="routes/blog/post.tsx"
import { MessagesProvider } from "@livemark/vite/react"
import Post from "./post.md"

export function PostPage() {
  return (
    <MessagesProvider messages={{ "callout.note": "注意" }}>
      <article className="prose dark:prose-invert">
        <Post />
      </article>
    </MessagesProvider>
  )
}
```

传入 `components` 可以在单次渲染中替换任意 Livemark 组件，例如 `<Post components={{ a: RouterLink }} />`。

- **`MessagesProvider`** 提供组件显示的界面文字，例如提示块标题和复制按钮的标签。未提供的键保持英文。键名与语言的 [`messages`](/zh/customization/translations/) 相同。
- **`@livemark/vite/react`** 中的 **`IconsProvider`** 按 Lucide 键名提供 `:icon` 和 `:::card{icon}` 渲染的图标：传入 lucide-react 的 `icons` 或其子集。没有它时不渲染任何图标。

## 集合

博客索引、标签页或站点地图需要每篇文章的 frontmatter，却不必加载每篇文章。集合列出一组文件而不含正文，并按需加载每篇正文：

```ts title="vite.config.ts"
import markdown, { defineCollection } from "@livemark/vite"
import { defineConfig } from "vite"
import { Post } from "./post.ts"

export const blog = defineCollection({
  name: "blog",
  include: "content/blog/**/*.md",
  schema: Post,
})

export default defineConfig({
  plugins: [markdown({ collections: [blog] })],
})
```

应用以 `virtual:livemark/collection/<name>` 导入它：

```tsx title="routes/blog/post.tsx"
import { lazy } from "react"
import { entries, load } from "virtual:livemark/collection/blog"

const posts = entries.map(entry => ({ ...entry, Body: lazy(() => load(entry.id)) }))
```

- **`entries`** 按路径排序列出每个文件，形如 `{ id, file, frontmatter, readingTime }`。`readingTime` 以分钟计，按每分钟 200 词，不计代码块。它不含正文，因此索引保持轻量。
- **`load(id)`** 导入某个条目编译后的模块，与直接导入该文件得到的模块相同。每个文件是独立的 chunk，未知的 id 会使 Promise 被拒绝。

| 选项      | 默认值              | 作用                                                      |
| --------- | ------------------- | --------------------------------------------------------- |
| `name`    |                     | 模块名：字母、数字、`_` 和 `-`                            |
| `include` |                     | `.md` 和 `.mdx` 文件，以相对 `root` 的 glob 表示          |
| `exclude` |                     | 排除的文件，以相对 `root` 的 glob 表示                    |
| `root`    | 工作目录            | glob 和 `file` 的起点目录                                 |
| `schema`  |                     | 校验每个文件的 frontmatter：zod schema 或任何 `{ parse }` |
| `id`      | 去掉扩展名的 `file` | 由 `file` 得出条目 id，例如 `file => file.split("/")[2]`  |

未通过 `schema` 的 frontmatter 会使构建失败并指出文件名，两个文件共用同一 id 时也是如此。`entries` 以 JSON 序列化，因此把日期转换为 `Date` 的 schema 在应用中得到的是字符串。

`blog.list()` 在 Node 中返回同样的条目，无需 Vite：配置可以用它列出要预渲染的页面。即使插件的 `include` 或 `exclude` 排除了集合中的文件，它们仍会被编译。在开发服务器中，改变 `entries` 的编辑会重新加载页面，而只改正文的编辑照常更新。

若要为 frontmatter 加上类型，在类型引用旁声明一次该模块：

```ts title="env.d.ts"
declare module "virtual:livemark/collection/blog" {
  import type { CollectionEntry, MarkdownModule } from "@livemark/vite"
  import type { Post } from "./post.ts"
  export const entries: CollectionEntry<Post>[]
  export function load(id: string): Promise<MarkdownModule>
}
```

## 样式

组件以源码形式发布，因此由你的 Tailwind CSS v4 构建来编译它们的类名。一份样式表即可加载 Markdown 样式，并让 Tailwind 扫描这些组件：

```css title="app.css"
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "@livemark/vite/styles.css";
@custom-variant dark (&:is(.dark *));
```

组件使用以下主题变量，由你的 CSS 在 `@theme` 中定义为 `--color-*`（Livemark 的取值见[这里](https://github.com/datisthq/livemark/blob/main/markdown/source/styles/general.css)）：

- `background`、`foreground`、`card`、`card-foreground`、`popover`、`popover-foreground`
- `primary`、`secondary`、`muted`、`accent`，各带 `-foreground`
- `border`、`input`、`ring`
- `positive`、`warning` 和 `destructive`，各带 `-tint` 和 `-tint-foreground`

圆角使用该样式表定义的 `rounded-card` 和 `rounded-control` 尺度。
