---
title: Starlight vs Livemark
label: Starlight
description: React + TanStack Start，对比用于文档的 Astro Islands。
path: /comparison/starlight/
icon: star
order: 4
---

# Starlight vs Livemark

[Starlight](https://starlight.astro.build) 是 Astro 官方的文档主题，由 Astro 团队维护。它采用 Astro 的岛屿架构（默认零 JavaScript，按需启用交互组件），并支持 MDX 内容。

## 概览 [#at-a-glance]

| 维度          | Livemark                   | Starlight                                                 |
| ------------- | -------------------------- | --------------------------------------------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | TypeScript / Node 18+                                     |
| UI 框架       | React 19                   | Astro 组件（HTML 优先），可选 React/Vue/Svelte/Solid 岛屿 |
| 构建工具      | Vite + TanStack Start      | Astro（底层基于 Vite）                                    |
| 内容格式      | Markdown + MDX             | Markdown + MDX + MDoc                                     |
| 许可证        | MIT，自托管                | MIT，自托管                                               |
| 输出模式      | 预渲染静态站点（支持 SSR） | 预渲染静态站点（通过适配器支持 SSR）                      |

## 架构 [#architecture]

Livemark 在构建时（预渲染）和运行时（客户端水合）渲染 React。每个页面都会加载 React；交互能力无处不在。

Starlight 采用 Astro 的岛屿模型：页面在构建时渲染为 HTML，默认零 JavaScript。交互组件是显式声明的「岛屿」，按需进行水合。Starlight 的默认主题主要由 Astro 组件构成（无客户端 JS）；使用 React/Vue/Svelte 需要主动启用。

两者都通过 Vite 构建。Astro 的组件模型是它自己的 `.astro` 语法（HTML + JS frontmatter，经静态分析）。Livemark 的组件模型是 React。

Livemark 对内容布局没有限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 由前置元数据 frontmatter 中的 `path:` 字段决定，而不是由文件位置决定。不强制要求 `docs/` 文件夹——项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或其他任何地方获取文章。Starlight 要求内容放在 `src/content/docs/`（Astro 的 content collections 目录）中，路由由该根目录下的文件路径推导而来。

## 内容能力 [#content-surface]

两者都支持带 frontmatter 的 Markdown + MDX。

Starlight 还支持 MDoc（Markdoc），用于编写带自定义标签、结构化且经过校验的内容。`.mdx` 文件中的组件默认是 Astro 组件；框架组件（React 等）需要显式的 `client:*` 指令才能水合。

Livemark 在 `.mdx` 文件中的组件都是 React；水合方式统一。

frontmatter 的结构不同：Starlight 使用 `title`、`description`、`sidebar`、`tableOfContents`、`editUrl`、`lastUpdated`。Livemark 使用 `path`、`order`、`icon`、`sidebar`、`date`、`tags`。

## 功能对比 [#feature-matrix]

| 能力           | Livemark                               | Starlight                               |
| -------------- | -------------------------------------- | --------------------------------------- |
| 版本管理       | 部分支持（栏目或按分支部署）           | 否（社区插件）                          |
| 国际化（i18n） | 是（内置）                             | 是（内置）                              |
| 搜索           | 是（Orama，客户端）                    | 是（Pagefind，内置）                    |
| 默认零 JS      | 否（React 会水合）                     | 是（岛屿架构）                          |
| 博客           | 是（内置栏目类型）                     | 否（使用 Astro 的 content collections） |
| 更新日志       | 是（栏目类型）                         | 否                                      |
| 站点地图       | 是                                     | 是                                      |
| RSS            | 是（每个博客栏目）                     | 通过 `@astrojs/rss` 集成                |
| 主题           | 通过 `.livemark/` 覆盖组件             | 通过 Starlight 插槽覆盖组件             |
| 插件           | Vite 插件 + remark/rehype              | Astro 集成 + Starlight 插件             |
| 自定义路由     | `.livemark/routes/`（TanStack Router） | 与 Starlight 内容并存的 Astro 页面      |

## 输出与部署 [#output--deployment]

两者都生成由静态 HTML 和资源文件组成的目录。Starlight 默认输出到 `dist/`；Livemark 输出到 `.livemark/build/client/`。托管方式完全相同——各平台指南参见 Livemark 的[部署](/zh/deployment/)。

Starlight 沿用 Astro 的适配器体系，支持在 Cloudflare、Netlify、Vercel、Node 和 Deno 上运行 SSR。Livemark 则依靠 TanStack Start 的 Nitro 预设实现同样的动态部署。

## 另请参阅 [#see-also]

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
