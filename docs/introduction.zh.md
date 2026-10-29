---
title: 介绍
description: 了解如何搭建你的第一个 Livemark 项目。
icon: rocket
path: /introduction/
order: 1
---

Livemark 能把普通的 Markdown 变成一个快速、现代的文档站点。只需指向一个包含 `.md` 文件的文件夹，它就会为你生成一个可部署的 React + Vite 站点，内置搜索、语法高亮、博客和更新日志栏目、深色模式，以及一套可定制的组件库。

## 你将获得 [#what-you-get]

- **只管写 Markdown。** 开箱即用地支持 GitHub 风格的 Markdown，包括前置元数据 frontmatter、自定义标题 ID、脚注、定义列表和 gemoji。
- **精美的代码块。** 由 [Shiki](https://shiki.style/) 提供语法高亮，支持 100 多种语言、浅色/深色双主题、行高亮、diff 以及 TwoSlash 类型提示。
- **图表与数学公式。** [Mermaid](https://mermaid.js.org/) 流程图和 KaTeX 公式，自动适配主题，无需配置。
- **丰富的元素。** 提示框、标签页、文件树、卡片、分栏、徽章、包管理器标签页（npm/pnpm/yarn/bun）、嵌入内容（YouTube、SoundCloud）等，均可通过 Markdown 指令或 MDX 组件使用。
- **栏目。** 一流的文档、博客（支持标签 + RSS）和更新日志（本地 `CHANGELOG.md` 或 GitHub releases）支持。
- **搜索。** 由 [Orama](https://oramasearch.com/) 驱动的全文搜索，会在你跳转到的页面上高亮匹配内容，支持键盘快捷键和智能目录。
- **可定制主题。** Tailwind v4、shadcn 风格的基础元素、深色模式，以及通过 `.livemark/` 文件夹进行的按文件覆盖。
- **基于 TanStack Start 构建。** SSR、预渲染、sitemap 和路由全部免费获得。

## 快速开始 [#quick-start]

你需要 [Node.js](https://nodejs.org/) 24+ 和一个包管理器（pnpm、npm、yarn 或 bun）。

### 安装 [#install]

```bash
npm install livemark
```

### 配置 [#configure]

在项目根目录创建 `livemark.config.ts`：

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "My docs",
  description: "Documentation for my project",
  include: ["docs/**/*.md"],
})
```

### 添加内容 [#add-content]

```text title="docs/"
docs/
├── getting-started.md
└── usage.md
```

每个 `.md` 文件都支持 frontmatter：

```md title="docs/getting-started.md"
---
title: Getting Started
description: Set up the project in five minutes.
icon: rocket
order: 1
---

# Getting Started

Welcome!
```

### 运行 [#run]

```bash
npx livemark start    # dev server with HMR at http://localhost:8000 and on the LAN (--no-host: local only)
npx livemark build    # production build to .livemark/build/
npx livemark preview  # serve the production build locally
npx livemark clear    # wipe the generated .livemark/.serve/, .build/ and .cache/ (stop the dev server first)
```

这就是完整的流程。记得把 `.livemark/build/` 加入 `.gitignore`。

## 项目结构 [#project-structure]

一个典型的 Livemark 站点：

```text title="my-project/"
my-project/
├── livemark.config.ts   # configuration
├── docs/                # markdown content
├── blog/                # blog posts (optional)
├── CHANGELOG.md         # changelog source (optional)
└── .livemark/           # overrides + build cache (generated)
```

`.livemark/components/`、`.livemark/elements/` 或 `.livemark/styles/` 下的任何文件都会覆盖 Livemark 中同路径的默认文件，因此你无需 fork 这个包，就能定制组件、基础元素和基础 CSS。运行 `npx livemark escape <path>` 可将某个默认文件复制到 `.livemark/` 中，以便直接编辑。

## 定制 [#customization]

Livemark 的目标是零配置也足够好看，而在你需要更多控制时又不会碍手碍脚。常见的定制项：

- **站点元数据**：标题、描述、favicon、logo。参见[站点元数据指南](/zh/customization/site-metadata/)。
- **栏目**：把内容拆分为 Docs / Blog / Changelog，各自使用独立的 URL 前缀。参见[文章栏目](/zh/customization/article-sections/)。
- **外部链接**：在顶栏和侧边栏中添加指向任意位置的链接。参见[外部链接](/zh/customization/external-links/)。
- **语法主题**：为浅色和深色模式分别设置 Shiki 主题。参见[语法主题](/zh/customization/syntax-themes/)。
- **文章补丁**：在 `livemark.config.ts` 中覆盖某个 Markdown 文件的 frontmatter，而无需改动该文件。参见[文章补丁](/zh/customization/article-patches/)。
- **覆盖（escape）**：在你的项目中替换任意内置组件或样式表。参见[覆盖（escape）](/zh/customization/overriding-escaping/)。
- **自定义路由**：在 `.livemark/routes/` 中放入一个 `.tsx` 文件，即可添加一个完全自定义的页面。参见[自定义路由](/zh/customization/custom-routes/)。

## 文档 [#documentation]

完整文档位于 **[livemark.dev](https://livemark.dev)**：

- [编写参考](/zh/authoring/)：每一项 Markdown / MDX 功能及示例
- [定制](/zh/customization/)：每一个配置项，附带可直接复制粘贴的代码片段
- [更新日志](/changelog/)：版本发布说明
- [贡献指南](/zh/contributing/)：本地环境搭建和 PR 流程

## 资源 [#resources]

- **npm**：[npmjs.com/package/livemark](https://www.npmjs.com/package/livemark)
- **GitHub**：[github.com/datisthq/livemark](https://github.com/datisthq/livemark)
- **Issues**：[github.com/datisthq/livemark/issues](https://github.com/datisthq/livemark/issues)
- **讨论**：[github.com/datisthq/livemark/discussions](https://github.com/datisthq/livemark/discussions)

## 许可证 [#license]

MIT，参见 [LICENSE.md](https://github.com/datisthq/livemark/blob/main/LICENSE.md)。
