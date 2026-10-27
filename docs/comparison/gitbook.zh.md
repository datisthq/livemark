---
title: GitBook vs Livemark
label: GitBook
description: 带块编辑器和 Git Sync 的托管 SaaS 与基于文件、自托管的静态文档对比。
path: /comparison/gitbook/
icon: notebook-pen
order: 10
---

# GitBook vs Livemark

[GitBook](https://www.gitbook.com) 是一个商业化的托管文档平台。编写在基于浏览器的块编辑器中进行（类似 Notion），内容存放在 GitBook 的数据库中，发布到 GitBook 托管的站点，域名位于 `gitbook.io` 之下或使用自定义域名。Git Sync 功能可以把该数据库以 Markdown 形式与 GitHub/GitLab 仓库双向镜像，但唯一可信来源是 GitBook 本身，而不是仓库。

较早的开源静态生成器 `gitbook-cli` 已于 2018 年弃用，与如今的产品无关；本页介绍的是当前的托管平台。

## 概览 [#at-a-glance]

| 维度          | Livemark                   | GitBook                                                 |
| ------------- | -------------------------- | ------------------------------------------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | 托管 SaaS（无本地运行时）                               |
| UI 框架       | React 19                   | 专有（由 GitBook 渲染）                                 |
| 构建工具      | Vite + TanStack Start      | 无（用户侧无需构建）                                    |
| 内容格式      | Markdown + MDX             | 编辑器中的块模型；通过 Git 时为 GitBook 风格的 Markdown |
| 许可证        | MIT，自托管                | 专有；免费版 + 付费方案；仅 Enterprise 支持自托管       |
| 输出模型      | 预渲染静态页面（支持 SSR） | 托管在 GitBook 基础设施上                               |

## 架构 [#architecture]

Livemark 基于 Vite、TanStack Start 和 React 构建。编写遵循 JS/TS 的惯例（`livemark.config.ts`、可通过 npm 安装的插件、用 React 编写的 MDX 组件），页面在构建时预渲染为静态 HTML。

GitBook 是一个多租户 SaaS。内容在基于块的所见即所得编辑器中编写：每个段落、标题、代码块、提示或嵌入内容都是一个带类型的块，存储在 GitBook 的数据库中。运行时是 GitBook 自己的：用户既不需要运行构建步骤，也没有需要部署的静态站点。托管、搜索索引、CDN、重定向和分析都由平台管理。

Git Sync 是一项可选集成，用于把 GitBook 空间映射到 GitHub 或 GitLab 仓库的某个分支。内容在编辑器与一个 `.md` 文件目录之间往返同步，这些文件使用 GitBook 扩展的 Markdown 方言编写（`{% hint %}` 提示、标签页、内容引用、OpenAPI 块等）。同步是双向的：编辑器中的修改会向仓库推送提交，推送到该分支的提交也会更新编辑器。仓库只是镜像，而非来源：GitBook 的数据结构才是权威模型。

在 Livemark 这边，内容的组织方式不受限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 默认取决于文件在其 `include` glob 下的位置，也可以由前置元数据 frontmatter 中的 `path:` 字段指定。不要求必须有 `docs/` 文件夹。GitBook 的内容按产品固定的层级组织（**组织 → 集合 → 空间 → 页面**），站点 URL 由这棵树推导而来。Git Sync 镜像以嵌套目录的形式反映这一层级。

## 内容能力 [#content-surface]

Livemark 接受 Markdown + MDX，支持嵌入 React 组件，将 frontmatter 作为一等概念（`path`、`order`、`icon`、`sidebar`、`date`、`tags`），并在构建时应用 remark/rehype 插件。

GitBook 的内容能力就是编辑器的块面板：段落、标题、列表、表格、提示（info/warning/danger/success）、标签页、可展开块、带标签组的代码块、文件、图片、绘图、数学公式（KaTeX）、嵌入内容（Figma、Loom 等）、API 方法块、OpenAPI 参考，以及内容引用（跨空间嵌入）。用户无法扩展自定义组件，可用的块就是 GitBook 提供的那些。Git Sync 使用的 Markdown 方言通过类似 Liquid 的标签来表示 CommonMark 中没有的块，例如 `{% hint style="info" %}…{% endhint %}` 和 `{% tabs %}…{% endtabs %}`。

OpenAPI 是一等输入：GitBook 可以导入 OpenAPI 规范并据此渲染 API 参考页面，这一点更接近 Mintlify 的能力，而不是 Livemark 的。

## 功能矩阵 [#feature-matrix]

| 能力                     | Livemark                               | GitBook                                                |
| ------------------------ | -------------------------------------- | ------------------------------------------------------ |
| 版本管理                 | 部分支持（栏目或按分支部署）           | 是（空间变体 / 版本组）                                |
| 国际化（i18n）           | 是（内置）                             | 是（空间的按语言变体）                                 |
| 搜索                     | 是（Orama，客户端）                    | 是（托管，付费方案提供 GitBook AI / “Lens” 问答）      |
| 博客                     | 是（内置栏目类型）                     | 否                                                     |
| 更新日志                 | 是（栏目类型）                         | 否（Change Requests 是编辑工作流，而不是已发布的栏目） |
| Sitemap                  | 是                                     | 是（由平台生成）                                       |
| RSS                      | 是（按博客栏目）                       | 否                                                     |
| 主题                     | 通过 `.livemark/` 覆盖组件             | 通过站点设置自定义（颜色、字体、布局）；不能覆盖模板   |
| 插件                     | Vite 插件 + remark/rehype              | 专有集成（Intercom、Segment、GA 等）                   |
| 自定义路由               | `.livemark/routes/`（TanStack Router） | 否（URL 遵循空间 → 页面的层级）                        |
| 基于 OpenAPI 的 API 参考 | 否（手动）                             | 是（内置）                                             |
| 独立工具链               | Node + npm                             | 用户侧无；SaaS                                         |

## 输出与部署 [#output--deployment]

Livemark 产出一个包含预渲染 HTML + 静态资源的目录（`.livemark/build/client/`），可以上传到任意静态托管服务。各托管平台的指南请参阅[部署](/zh/deployment/)。

GitBook 不产出可部署的产物。站点默认托管在 `<space>.gitbook.io`，也可以通过 DNS 绑定自定义域名。CDN、TLS、重定向、访问控制和分析都在 GitBook 控制台中配置。自托管仅限 Enterprise 方案，标准方案不提供。最接近“你的内容”的产物，是 Git Sync 镜像写入所连接仓库的那些文件，而它们只是内容，并不是可构建的站点。

## 另请参阅 [#see-also]

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
