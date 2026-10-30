---
title: Docusaurus vs Livemark
label: Docusaurus
description: 两款 React + MDX 文档框架的逐项技术对比。
path: /comparison/docusaurus/
icon: book-text
order: 1
---

# Docusaurus vs Livemark

[Docusaurus](https://docusaurus.io) 是由 Meta 维护的开源文档框架。它通过基于 Webpack 的构建流水线渲染 React + MDX 内容，提供一流的版本管理和国际化支持，并拥有庞大的插件生态。

## 概览 {#at-a-glance}

| 维度          | Livemark                   | Docusaurus            |
| ------------- | -------------------------- | --------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | TypeScript / Node 18+ |
| UI 框架       | React 19                   | React 18              |
| 构建工具      | Vite + TanStack Start      | Webpack               |
| 内容格式      | Markdown + MDX             | Markdown + MDX        |
| 许可证        | MIT，自托管                | MIT，自托管           |
| 输出模型      | 预渲染静态页面（支持 SSR） | 预渲染静态页面        |

## 架构 {#architecture}

Livemark 将 Vite、TanStack Start 和 React 封装进一个零配置的 CLI。内容从 glob 匹配到的 `.md` 文件中加载，在构建时按 Markdown 编译（`.mdx` 文件按 MDX 编译），并为每个路由预渲染为静态 HTML。

Docusaurus 基于 Webpack 构建。其运行时由 React Router + Docusaurus 核心组成，核心负责主题、插件和内容来源。插件是一等公民：每个内置功能（文档、博客、页面、搜索）本身都是插件，第三方也以同样的方式扩展系统。

在 Livemark 这边，内容的组织方式不受限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 默认取决于文件在其 `include` glob 下的位置，也可以由前置元数据 frontmatter 中的 `path:` 字段指定。不要求必须有 `docs/` 文件夹，项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或任何其他位置获取文章。Docusaurus 的文档插件需要一个 `docs/` 目录（可通过 `path` 配置，但基于文件夹而非 glob）。

## 内容能力 {#content-surface}

两款工具都接受带 frontmatter 的 Markdown 和 MDX，也都允许在 `.mdx` 文件中嵌入 React 组件。

Livemark 的指令（`:::card`、`:::tip`、`:::tab`……）由 Livemark 运行的 Rust Markdown 管线 textlane 编译。Docusaurus 使用 MDX 组件，并通过 `admonition` 扩展实现提示框。

frontmatter 的结构不同：Livemark 使用 `path`、`order`、`icon`、`sidebar`、`date`、`tags`；Docusaurus 使用 `id`、`slug`、`sidebar_position`、`sidebar_label`、`tags`。

## 功能矩阵 {#feature-matrix}

| 能力           | Livemark                               | Docusaurus                      |
| -------------- | -------------------------------------- | ------------------------------- |
| 版本管理       | 部分支持（栏目或按分支部署）           | 是（内置）                      |
| 国际化（i18n） | 是（内置）                             | 是（内置）                      |
| 搜索           | 是（Orama，客户端）                    | 集成 Algolia DocSearch          |
| 博客           | 是（内置栏目类型）                     | 是（内置插件）                  |
| 更新日志       | 是（栏目类型，按版本标题拆分）         | 否（社区插件）                  |
| Sitemap        | 是                                     | 是                              |
| RSS            | 是（按博客栏目）                       | 是（博客插件提供）              |
| 主题           | 通过 `.livemark/` 覆盖组件             | 主题包（`@docusaurus/theme-*`） |
| 插件           | Vite 插件 + textlane                   | 一流的插件 API                  |
| 自定义路由     | `.livemark/routes/`（TanStack Router） | 由插件定义的路由                |

## 输出与部署 {#output--deployment}

Livemark 将每个路由预渲染到磁盘上的 `.livemark/build/client/`，各托管平台的具体指南请参阅[部署](/zh/deployment/)。

Docusaurus 同样预渲染为静态 HTML，输出到 `build/`。这些静态产物可以运行在同样的托管平台上（GitHub Pages、Cloudflare、Vercel、Netlify、静态托管）。Docusaurus 内置的 i18n 会为每种语言生成独立的输出目录树。

## 另请参阅 {#see-also}

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
