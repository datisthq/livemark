---
title: VitePress vs Livemark
label: VitePress
description: 两个基于不同 UI 技术栈、原生基于 Vite 且以 Markdown 为先的文档框架。
path: /comparison/vitepress/
icon: zap
order: 2
---

# VitePress vs Livemark

[VitePress](https://vitepress.dev) 是 Vue 官方的文档框架，基于 Vite 构建。它以 Markdown 为先，自带一个精简的默认主题，Vue 生态中的大多数文档（Vue 本身、Vite、Pinia……）都由它驱动。

## 概览 {#at-a-glance}

| 维度          | Livemark                   | VitePress                    |
| ------------- | -------------------------- | ---------------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | TypeScript / Node 18+        |
| UI 框架       | React 19                   | Vue 3                        |
| 构建工具      | Vite + TanStack Start      | Vite（自定义构建流水线）     |
| 内容格式      | Markdown + MDX             | 支持 Vue 模板语法的 Markdown |
| 许可证        | MIT，自托管                | MIT，自托管                  |
| 输出模式      | 预渲染静态站点（支持 SSR） | 预渲染静态站点（SSG）        |

## 架构 {#architecture}

两者都原生基于 Vite。区别在于 Vite 之上的一切：Livemark 叠加了 TanStack Start（路由 + 服务端函数 + 预渲染流水线）并渲染 React；VitePress 用自己的 SSG 流水线封装 Vite，并渲染 Vue。

VitePress 的运行时是 `vue-router` 加上内置的默认主题。Livemark 使用 TanStack Router，并自带一套组件层（侧边栏、布局、搜索），使用者可以通过 `.livemark/` 逐文件覆盖。

Livemark 对内容布局没有限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 默认取决于文件在其 `include` glob 下的位置，也可以由前置元数据 frontmatter 中的 `path:` 字段指定。不强制要求 `docs/` 文件夹——项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或其他任何地方获取文章。VitePress 要求所有内容位于单一源码根目录下（默认 `docs/`，可通过 `srcDir` 配置），路由由文件路径推导而来。

## 内容能力 {#content-surface}

VitePress 支持内置 Vue 模板语法的 Markdown——你可以在 `.md` 文件中使用 Vue 组件和 `<script setup>` 块。它**不**支持 React 意义上的 MDX。

Livemark 支持 Markdown + MDX。嵌入的组件是 React 组件。

两者都支持用 frontmatter 定义每个页面的元数据。VitePress 使用 `title`、`layout`、`sidebar`、`outline`、`prev`/`next`。Livemark 使用 `path`、`order`、`icon`、`sidebar`、`date`、`tags`。

提示框：VitePress 使用 `::: tip` / `::: warning` 容器（与 Livemark 的 `:::tip` 指令语法相同，但由不同的解析器处理）。

## 功能对比 {#feature-matrix}

| 能力           | Livemark                               | VitePress                           |
| -------------- | -------------------------------------- | ----------------------------------- |
| 版本管理       | 部分支持（栏目或按分支部署）           | 否（社区变通方案）                  |
| 国际化（i18n） | 是（内置）                             | 是（内置）                          |
| 搜索           | 是（Orama，客户端）                    | 是（本地 + Algolia）                |
| 博客           | 是（内置栏目类型）                     | 否（社区插件）                      |
| 更新日志       | 是（栏目类型）                         | 否                                  |
| 站点地图       | 是                                     | 是                                  |
| RSS            | 是（每个博客栏目）                     | 否                                  |
| 主题           | 通过 `.livemark/` 覆盖组件             | 通过 `.vitepress/theme/` 自定义主题 |
| 插件           | Vite 插件 + textlane                   | Vite 插件 + markdown-it 插件        |
| 自定义路由     | `.livemark/routes/`（TanStack Router） | 通过 `paths()` 实现动态路由         |

## 输出与部署 {#output--deployment}

两者都生成由静态 HTML 和资源文件组成、可部署到任何静态托管平台的目录。VitePress 默认输出到 `.vitepress/dist/`；Livemark 输出到 `.livemark/build/client/`。托管方式完全一致——各平台指南参见 Livemark 的[部署](/zh/deployment/)。

## 另请参阅 {#see-also}

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
