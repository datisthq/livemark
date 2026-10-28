---
title: MkDocs vs Livemark
label: MkDocs
description: TypeScript + React + MDX，对比 Python + Jinja2 + Markdown。
path: /comparison/mkdocs/
icon: book-marked
order: 7
---

# MkDocs vs Livemark

[MkDocs](https://www.mkdocs.org) 是一个基于 Python 的文档生成器。内容是纯 Markdown，布局是 Jinja2 模板，主题是可通过 pip 安装的 Python 包。事实上的标准主题是 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)，大多数用户实际使用的正是它。

## 概览 [#at-a-glance]

| 维度          | Livemark                   | MkDocs                                        |
| ------------- | -------------------------- | --------------------------------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | Python 3.8+                                   |
| UI 框架       | React 19                   | Jinja2 模板（HTML + CSS）                     |
| 构建工具      | Vite + TanStack Start      | MkDocs CLI                                    |
| 内容格式      | Markdown + MDX             | Markdown（CommonMark + Python-Markdown 扩展） |
| 许可证        | MIT，自托管                | BSD-2-Clause，自托管                          |
| 输出模式      | 预渲染静态站点（支持 SSR） | 预渲染静态站点                                |

## 架构 [#architecture]

Livemark 基于 Vite、TanStack Start 和 React 构建。编写遵循 JS/TS 的惯例（`livemark.config.ts`、可通过 npm 安装的插件、用 React 编写的 MDX 组件）。

MkDocs 是一个 Python CLI。站点通过 `mkdocs.yml` 配置。主题通过 pip 安装；构建流水线让 Markdown 内容依次经过 Python-Markdown（或 pymdown-extensions）和 Jinja2 模板处理。没有 JavaScript 构建步骤——渲染后站点的交互能力完全取决于主题模板输出的内容。

Material for MkDocs 提供了精心打磨的主题、基于 lunr.js 的搜索索引、即时导航以及丰富的插件生态（`mkdocs-material` 扩展，以及 PyPI 上更广泛的 `mkdocs-*` 插件命名空间）。

Livemark 对内容布局没有限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 默认取决于文件在其 `include` glob 下的位置，也可以由前置元数据 frontmatter 中的 `path:` 字段指定。不强制要求 `docs/` 文件夹——项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或其他任何地方获取文章。MkDocs 从 `docs/` 读取内容（可通过 `mkdocs.yml` 中的 `docs_dir` 配置），路由由该目录下的文件路径推导而来。

## 内容能力 [#content-surface]

两者都支持带 frontmatter 的 Markdown。最大的差异在于组件嵌入：Livemark 支持 MDX（在 `.mdx` 文件中使用 React 组件）；MkDocs 只支持 Markdown。

MkDocs 通过 Python-Markdown 扩展（提示框、标签页、脚注、定义列表）和 `pymdown-extensions`（提供完整的 Material 语法：`=== "Tab 1"` 标签页、`:::note` 提示框、`++ctrl++` 键盘快捷键等）来扩展 Markdown。超出这些扩展能力的定制需要编写 Python 插件或覆盖 Jinja 模板。

frontmatter 的结构不同：MkDocs 读取 `title`、`summary`、`tags`（需插件）、`template`，并使用 `mkdocs.yml` 定义导航。Livemark 使用 `path`、`order`、`icon`、`sidebar`、`date`、`tags`。

## 功能对比 [#feature-matrix]

| 能力           | Livemark                               | MkDocs (Material)                   |
| -------------- | -------------------------------------- | ----------------------------------- |
| 版本管理       | 部分支持（栏目或按分支部署）           | 是（通过 `mike` 插件）              |
| 国际化（i18n） | 是（内置）                             | 是（Material 的 i18n 插件）         |
| 搜索           | 是（Orama，客户端）                    | 是（内置，客户端）                  |
| 博客           | 是（内置栏目类型）                     | 是（Material 的博客插件）           |
| 更新日志       | 是（栏目类型）                         | 否（手动维护）                      |
| 站点地图       | 是                                     | 是                                  |
| RSS            | 是（每个博客栏目）                     | 通过插件                            |
| 主题           | 通过 `.livemark/` 覆盖组件             | 主题包 + Jinja 模板覆盖             |
| 插件           | Vite 插件 + remark/rehype              | Python 插件（PyPI 上的 `mkdocs-*`） |
| 自定义路由     | `.livemark/routes/`（TanStack Router） | 否（仅内容）                        |
| 独立工具链     | Node + npm                             | Python + pip                        |

## 输出与部署 [#output--deployment]

两者都生成可部署到任何静态托管平台的静态 HTML 和资源文件。MkDocs 默认输出到 `site/`；Livemark 输出到 `.livemark/build/client/`。托管方式完全相同——各平台指南参见 Livemark 的[部署](/zh/deployment/)。

## 另请参阅 [#see-also]

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
