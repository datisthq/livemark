---
title: Fumadocs vs Livemark
label: Fumadocs
description: 用于文档的 Vite + TanStack Start 与 Next.js App Router 对比。
path: /comparison/fumadocs/
icon: square-dashed
order: 5
---

# Fumadocs vs Livemark

[Fumadocs](https://fumadocs.dev) 是一款基于 Next.js、围绕 App Router 构建的文档框架。它将职责拆分到几个独立的包中：`fumadocs-core`（无界面逻辑）、`fumadocs-ui`（默认 UI 组件）和 `fumadocs-mdx`（内容来源加载器）。

## 概览 [#at-a-glance]

| 维度          | Livemark                   | Fumadocs                          |
| ------------- | -------------------------- | --------------------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | TypeScript / Node 18+             |
| UI 框架       | React 19                   | React 18/19（Next.js App Router） |
| 构建工具      | Vite + TanStack Start      | Next.js（Turbopack/Webpack）      |
| 内容格式      | Markdown + MDX             | Markdown + MDX                    |
| 许可证        | MIT，自托管                | MIT，自托管                       |
| 输出模型      | 预渲染静态页面（支持 SSR） | 静态或 SSR（Next.js 的各种模式）  |

## 架构 [#architecture]

Livemark 封装了 Vite + TanStack Start。路由、预渲染和组件覆盖都来自 TanStack Start；Livemark 在此之上加入 content-collections 来加载内容，并提供一层默认的侧边栏、布局和组件。

Fumadocs 假定你已经有（或打算有）一个 Next.js 应用。它不是一个自包含的 CLI：你需要先搭建一个 Next 项目，安装 Fumadocs 的包，再把 `fumadocs-core` 和 `fumadocs-ui` 接入你的 App Router。内容由 `fumadocs-mdx` 从 `.md`/`.mdx` 文件中读取，并以带类型的对象形式提供。

这种拆包是有意为之：`fumadocs-core` 暴露不含 UI 的 hooks 和基础原语，因此项目可以用自定义 UI 替换 `fumadocs-ui`，而无需 fork。

在 Livemark 这边，内容的组织方式不受限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 由前置元数据 frontmatter 中的 `path:` 字段决定，而不是由文件位置决定。不要求必须有 `docs/` 文件夹，项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或任何其他位置获取文章。Fumadocs 从单个已配置的内容目录读取（在 `fumadocs-mdx` 的 source 插件中定义）；路由由该根目录下的文件路径推导而来。

## 内容能力 [#content-surface]

两款工具都接受带 frontmatter 和内嵌 React 组件的 Markdown + MDX。

Fumadocs 使用 `fumadocs-mdx`（一个自定义的 MDX 加载器），生成带 TypeScript 类型的内容对象，frontmatter 具备完整的 IntelliSense 支持。自定义组件与你的 Next 应用代码放在一起。

Livemark 在底层使用 content-collections 实现同样的目的：经过校验的 frontmatter（通过 Zod schema）和带类型的文章导出。

frontmatter 的结构不同：Fumadocs 使用 `title`、`description`、`icon`、`full`；Livemark 使用 `path`、`order`、`icon`、`sidebar`、`date`、`tags`。

## 功能矩阵 [#feature-matrix]

| 能力           | Livemark                               | Fumadocs                          |
| -------------- | -------------------------------------- | --------------------------------- |
| 版本管理       | 部分支持（栏目或按分支部署）           | 部分支持（通过独立的内容来源）    |
| 国际化（i18n） | 是（内置）                             | 是（内置）                        |
| 搜索           | 是（Orama，客户端）                    | 是（基于 Orama，可选 Algolia）    |
| OpenAPI 渲染   | 否                                     | 是（`fumadocs-openapi`）          |
| 博客           | 是（内置栏目类型）                     | 否（使用 Next 路由）              |
| 更新日志       | 是（栏目类型）                         | 否                                |
| Sitemap        | 是                                     | 通过 Next.js 的 `sitemap.ts`      |
| RSS            | 是（按博客栏目）                       | 通过 Next.js 路由                 |
| 主题           | 通过 `.livemark/` 覆盖组件             | 替换 `fumadocs-ui` 或逐个覆盖组件 |
| 自定义路由     | `.livemark/routes/`（TanStack Router） | 任意 Next App Router 页面         |
| 独立 CLI       | 是（`livemark build`）                 | 否（Next.js 命令）                |

## 输出与部署 [#output--deployment]

Livemark 在构建时预渲染每个路由。产物是一个静态目录，可以部署到任何地方，请参阅[部署](/zh/deployment/)。

Fumadocs 沿用 Next.js 的输出模式：完全静态导出（`output: 'export'`）、SSG/SSR 混合，或完全动态。部署方式与 Next.js 支持的方式一致：默认目标是 Vercel，但任何 Node 托管平台或 Cloudflare Workers（通过 OpenNext）都可以。

## 另请参阅 [#see-also]

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
