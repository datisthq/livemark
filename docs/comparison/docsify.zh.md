---
title: Docsify vs Livemark
label: Docsify
description: 静态站点生成器与在浏览器中运行时渲染 Markdown 的工具对比。
path: /comparison/docsify/
icon: wind
order: 9
---

# Docsify vs Livemark

[Docsify](https://docsify.js.org) 是一款文档站点工具，其思路与本栏目中的其他所有工具都不同：它不在构建时生成静态 HTML，而是提供一个 `index.html` 和一个 JavaScript 运行时，在浏览器中获取 Markdown 文件并即时渲染。它没有构建步骤。

## 概览 [#at-a-glance]

| 维度          | Livemark                   | Docsify                                   |
| ------------- | -------------------------- | ----------------------------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | 浏览器端 JavaScript（无需构建）           |
| UI 框架       | React 19                   | 原生 JS + Vue 风格的模板指令              |
| 构建工具      | Vite + TanStack Start      | 无（运行时获取 + 渲染）                   |
| 内容格式      | Markdown + MDX             | Markdown（在浏览器中使用 marked / Prism） |
| 许可证        | MIT，自托管                | MIT，自托管                               |
| 输出模型      | 预渲染静态页面（支持 SSR） | 由原始 `.md` 文件在客户端渲染             |

## 架构 [#architecture]

Livemark 基于 Vite、TanStack Start 和 React 构建。编写遵循 JS/TS 的惯例（`livemark.config.ts`、可通过 npm 安装的插件、用 React 编写的 MDX 组件）。页面在构建时预渲染为静态 HTML，也可以在服务端运行。

Docsify 没有构建流水线。一个站点就是一个 `index.html`，它从 CDN（或 `node_modules`）加载 `docsify.js`，并在 `window.$docsify` 上放置一个小型配置对象。运行时，脚本读取 URL 的 hash（`#/some/page`），用 `fetch()` 获取对应的 `.md` 文件，交给 `marked` 解析 Markdown、交给 `Prism` 做语法高亮，再把结果注入页面。导航默认基于 hash；History API 模式需要手动开启，且依赖服务端重写。

在 Livemark 这边，内容的组织方式不受限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 由前置元数据 frontmatter 中的 `path:` 字段决定，而不是由文件位置决定。不要求必须有 `docs/` 文件夹，项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或任何其他位置获取文章。Docsify 从单一的源根目录读取内容（即包含 `index.html` 的目录，可通过 `basePath` 配置），请求的 URL 直接映射到磁盘上的文件路径：`#/guide/install` 会获取 `guide/install.md`。侧边栏导航需要在 `_sidebar.md` 中手动编写，没有自动生成的导航。

## 内容能力 [#content-surface]

两款工具都接受 Markdown。不对称之处在于能嵌入什么以及如何渲染。

Docsify 支持普通 Markdown（通过 `marked` 实现的 CommonMark）以及少量内置扩展：辅助功能（借助 [`docsify-tabs`](https://jhildenbiddle.github.io/docsify-tabs/) 和 admonition 插件实现 `> [!TIP]` 风格的提示框）、HTML 直通，以及在加载可选的 Vue 编译器后可用的有限 Vue 模板风格指令。它没有 MDX，默认不解析 frontmatter（可通过插件添加），也没有页面级的 React 组件。插件通过向 `window.$docsify.plugins` 推入函数来注册，并挂接到生命周期（`init`、`mounted`、`beforeEach`、`afterEach`、`doneEach`、`ready`）上。

Livemark 接受 Markdown + MDX，支持完整的 React 组件嵌入，将 frontmatter 作为一等概念（`path`、`order`、`icon`、`sidebar`、`date`、`tags`），并在构建时应用 remark/rehype 插件。

## 功能矩阵 [#feature-matrix]

| 能力           | Livemark                               | Docsify                                      |
| -------------- | -------------------------------------- | -------------------------------------------- |
| 版本管理       | 部分支持（栏目或按分支部署）           | 是（通过 `alias` 配置运行多个实例）          |
| 国际化（i18n） | 是（内置）                             | 是（`fallbackLanguages` + 按语言区分的文件） |
| 搜索           | 是（Orama，客户端）                    | 是（内置全文搜索插件）                       |
| 博客           | 是（内置栏目类型）                     | 否                                           |
| 更新日志       | 是（栏目类型）                         | 否（手动）                                   |
| Sitemap        | 是                                     | 否（第三方插件）                             |
| RSS            | 是（按博客栏目）                       | 否                                           |
| 主题           | 通过 `.livemark/` 覆盖组件             | CSS 主题（`vue.css`、`buble.css` 等）        |
| 插件           | Vite 插件 + remark/rehype              | 挂在 `window.$docsify` 上的运行时 JS 插件    |
| 自定义路由     | `.livemark/routes/`（TanStack Router） | 否（URL 与文件路径一一对应）                 |
| 独立工具链     | Node + npm                             | 运行时无需；`docsify-cli` 仅用于初始化       |

## 输出与部署 [#output--deployment]

这是两款工具差异最大的地方。

Livemark 产出一个包含预渲染 HTML + 静态资源的目录（`.livemark/build/client/`）。每个路由都是一个真实的 HTML 文件；爬虫、链接预览和禁用 JS 的客户端都能看到渲染后的内容。托管方式与常规静态站点相同，各托管平台的指南请参阅[部署](/zh/deployment/)。

Docsify 将原始 `.md` 文件与 `index.html` 一起发布。所谓“部署”，就是把源目录上传到任意静态托管服务。其中的取舍是：零构建时间、改完即刷新的编写体验，代价是首次绘制时 HTML 为空，搜索引擎、社交平台预览和无 JS 客户端只能看到加载器外壳。该项目文档介绍了一套 [SSR/预渲染工作流](https://docsify.js.org/#/ssr)，借助 `docsify-ssr` 或外部预渲染工具，为重视 SEO 的站点缓解这一问题。

## 另请参阅 [#see-also]

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
