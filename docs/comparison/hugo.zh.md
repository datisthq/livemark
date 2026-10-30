---
title: Hugo vs Livemark
label: Hugo
description: 以文档为先的 Node 工具与通用的 Go 静态站点生成器对比。
path: /comparison/hugo/
icon: feather
order: 8
---

# Hugo vs Livemark

[Hugo](https://gohugo.io) 是一款用 Go 编写的通用静态站点生成器。它以单个二进制文件分发，构建速度极快，借助 [Docsy](https://www.docsy.dev) 和 [Hugo Book](https://github.com/alex-shpak/hugo-book) 等社区主题，可用于从博客、作品集到文档站点的各种场景。

## 概览 {#at-a-glance}

| 维度          | Livemark                   | Hugo                           |
| ------------- | -------------------------- | ------------------------------ |
| 语言 / 运行时 | TypeScript / Node 24+      | Go（单个二进制文件，无运行时） |
| UI 框架       | React 19                   | Go 模板（HTML + CSS）          |
| 构建工具      | Vite + TanStack Start      | Hugo 二进制文件                |
| 内容格式      | Markdown + MDX             | 带 Hugo shortcode 的 Markdown  |
| 许可证        | MIT，自托管                | Apache-2.0，自托管             |
| 输出模型      | 预渲染静态页面（支持 SSR） | 预渲染静态页面                 |

## 架构 {#architecture}

Livemark 是一个基于 Vite + TanStack Start + React 构建的 Node CLI。编写遵循 JS/TS 的惯例。

Hugo 是单个 Go 二进制文件：没有运行时依赖，也没有安装包的步骤。站点结构基于约定：`content/`、`layouts/`、`static/`、`themes/`、`config.toml`（或 `.yaml`/`.json`）。布局使用 Go 的 `html/template` 语法。主题以 git 子模块的方式引入，或复制到 `themes/<name>/` 中。

Hugo 并非专门面向文档。同一个二进制文件可用于博客、营销网站、作品集和文档；文档场景通过主题来支持，而不是通过一等的栏目类型。

在 Livemark 这边，内容的组织方式不受限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 默认取决于文件在其 `include` glob 下的位置，也可以由前置元数据 frontmatter 中的 `path:` 字段指定。不要求必须有 `docs/` 文件夹，项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或任何其他位置获取文章。Hugo 从 `content/` 读取内容，URL 结构与目录树保持一致（并支持按栏目覆盖 frontmatter）。

## 内容能力 {#content-surface}

两款工具都接受带 frontmatter 的 Markdown。

最大的不对称在于组件嵌入：Livemark 使用 MDX（在 `.mdx` 文件中使用 React 组件）。Hugo 使用 **shortcode**，即在 Markdown 中通过 `{{< shortcode-name arg="value" >}}` 调用的 Go 模板函数。shortcode 以 Go 模板片段的形式定义在 `layouts/shortcodes/*.html` 中，并直接输出 HTML。

Hugo 支持基于 Goldmark 的 Markdown 扩展（脚注、表格、定义列表、通过插件实现的数学公式）。如需更丰富的交互，常见做法是嵌入一个 `<script>`，或在 shortcode 中以孤岛形式使用某个 JS 框架。

frontmatter 的结构不同：Hugo 接受 TOML、YAML 或 JSON 格式的 frontmatter，字段包括 `title`、`date`、`draft`、`weight`、`taxonomies` 以及用户自定义字段。Livemark 使用内联 YAML，字段为 `path`、`order`、`icon`、`sidebar`、`date`、`tags`。

## 功能矩阵 {#feature-matrix}

| 能力           | Livemark                               | Hugo                                 |
| -------------- | -------------------------------------- | ------------------------------------ |
| 版本管理       | 部分支持（栏目或按分支部署）           | 否（通过分支/站点手动实现）          |
| 国际化（i18n） | 是（内置）                             | 是（内置，多语言模式）               |
| 搜索           | 是（Orama，客户端）                    | 否（由主题提供或使用外部服务）       |
| 博客           | 是（内置栏目类型）                     | 是（任何栏目都可以按日期排序）       |
| 更新日志       | 是（栏目类型）                         | 否（手动）                           |
| Sitemap        | 是                                     | 是（内置）                           |
| RSS            | 是（按博客栏目）                       | 是（内置，按栏目）                   |
| 主题           | 通过 `.livemark/` 覆盖组件             | 支持模板覆盖的主题目录               |
| 插件           | Vite 插件 + textlane                   | Hugo Modules（Go）、shortcode、hooks |
| 自定义路由     | `.livemark/routes/`（TanStack Router） | 布局 + 内容栏目                      |
| 独立工具链     | Node + npm                             | 单个 Go 二进制文件                   |
| 构建速度       | Vite 级别的速度                        | 最快的 SSG 之一                      |

## 输出与部署 {#output--deployment}

两款工具都产出静态 HTML + 静态资源，可直接用于任意静态托管服务。Hugo 默认输出到 `public/`；Livemark 输出到 `.livemark/build/client/`。托管方式相同，各托管平台的指南请参阅 Livemark 的[部署](/zh/deployment/)。

## 另请参阅 {#see-also}

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
