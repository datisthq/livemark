---
title: Nextra vs Livemark
label: Nextra
description: Vite + TanStack Start，对比采用成熟主题包模式的 Next.js。
path: /comparison/nextra/
icon: square-stack
order: 6
---

# Nextra vs Livemark

[Nextra](https://nextra.site) 是一个基于 Next.js、采用主题包架构的文档框架。它最初基于 Pages Router，后来也迁移支持了 App Router。文档站点选择一个主题（文档用 `nextra-theme-docs`，博客用 `nextra-theme-blog`）并对其进行配置。

## 概览 [#at-a-glance]

| 维度          | Livemark                   | Nextra                       |
| ------------- | -------------------------- | ---------------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | TypeScript / Node 18+        |
| UI 框架       | React 19                   | React 18/19（Next.js）       |
| 构建工具      | Vite + TanStack Start      | Next.js（Turbopack/Webpack） |
| 内容格式      | Markdown + MDX             | Markdown + MDX               |
| 许可证        | MIT，自托管                | MIT，自托管                  |
| 输出模式      | 预渲染静态站点（支持 SSR） | 静态或 SSR（Next.js 模式）   |

## 架构 [#architecture]

Livemark 是一个基于 Vite + TanStack Start 的 CLI：一个工具、一个配置文件，内容放在 `.md` 文件中。

Nextra 是构建在现有 Next.js 应用之上的一层。搭建时需要安装 `nextra` 和一个主题包，在 `next.config.js` 中接入它们，并在每个目录下用 `_meta.json`（Pages Router）或 `meta.js`（App Router）文件定义导航。主题包掌控整个 UI；定制通过主题文档中提供的钩子完成。

`nextra-theme-docs` 是 Vercel、SWR、Turbo 等众多项目使用的文档主题。它稳定、持续维护，并且在文档场景下功能完备。

Livemark 对内容布局没有限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 由前置元数据 frontmatter 中的 `path:` 字段决定，而不是由文件位置决定。不强制要求 `docs/` 文件夹——项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或其他任何地方获取文章。Nextra 从 `pages/`（Pages Router）或 `content/`（App Router）读取内容，路由由文件路径和同级的 `_meta.json` 文件决定。

## 内容能力 [#content-surface]

两者都支持带 frontmatter 和嵌入 React 组件的 Markdown + MDX。

Nextra 通过 `next-mdx-remote` 支持远程 MDX，通过插件支持 KaTeX/Mermaid，并通过 Next 的 `<Image>` 组件实现图片优化。

frontmatter 的结构不同：Nextra 使用 `title`、`description`、`searchable`、`hide_title`，并通过每个目录下的 `_meta.json` 定义导航。Livemark 的所有设置都写在内联 frontmatter 中（`path`、`order`、`icon`、`sidebar`、`date`、`tags`），站点级导航则由单个 `livemark.config.ts` 定义。

## 功能对比 [#feature-matrix]

| 能力           | Livemark                               | Nextra                                       |
| -------------- | -------------------------------------- | -------------------------------------------- |
| 版本管理       | 部分支持（栏目或按分支部署）           | 否（社区变通方案）                           |
| 国际化（i18n） | 是（内置）                             | 是（通过 Next i18n + Nextra 钩子）           |
| 搜索           | 是（Orama，客户端）                    | 是（内置 FlexSearch，可选 Algolia/Pagefind） |
| 博客           | 是（内置栏目类型）                     | 是（`nextra-theme-blog`）                    |
| 更新日志       | 是（栏目类型）                         | 否（社区插件）                               |
| 站点地图       | 是                                     | 通过 Next.js `sitemap.ts`                    |
| RSS            | 是（每个博客栏目）                     | 是（博客主题），文档则通过 Next 路由         |
| 主题           | 通过 `.livemark/` 覆盖组件             | 主题包；通过主题配置定制                     |
| 自定义路由     | `.livemark/routes/`（TanStack Router） | 任意 Next 页面 / 路由                        |
| 独立 CLI       | 是（`livemark build`）                 | 否（使用 Next.js 命令）                      |

## 输出与部署 [#output--deployment]

Livemark 在构建时预渲染每个路由——输出位于 `.livemark/build/client/`，可部署到任何静态托管平台（参见[部署](/zh/deployment/)）。

Nextra 沿用 Next.js 的输出模式。最常见的文档配置是完全静态导出（`output: 'export'`），生成的静态目录可以部署到任何地方。SSR 配置则面向 Vercel 或 Node 托管平台。

## 另请参阅 [#see-also]

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
