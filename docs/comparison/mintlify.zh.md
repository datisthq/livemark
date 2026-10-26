---
title: Mintlify vs Livemark
label: Mintlify
description: 自托管的开源文档，对比托管式商业文档 SaaS。
path: /comparison/mintlify/
icon: sparkles
order: 3
---

# Mintlify vs Livemark

[Mintlify](https://mintlify.com) 是一个商业文档平台。内容在 Git 仓库中以 MDX 编写；Mintlify 负责托管渲染后的站点、搜索和数据分析。按编辑者数量计费，并为开源项目提供免费套餐。

## 概览 [#at-a-glance]

| 维度          | Livemark                   | Mintlify                                              |
| ------------- | -------------------------- | ----------------------------------------------------- |
| 语言 / 运行时 | TypeScript / Node 24+      | 使用 MDX 编写；运行时是 Mintlify 的托管平台（未公开） |
| UI 框架       | React 19                   | React（据 Mintlify 文档）                             |
| 构建工具      | Vite + TanStack Start      | Mintlify CLI（预览）+ 托管构建                        |
| 内容格式      | Markdown + MDX             | Markdown + MDX                                        |
| 许可证        | MIT，自托管                | 专有，仅托管                                          |
| 输出模式      | 预渲染静态站点（支持 SSR） | 托管在 Mintlify 基础设施上                            |

## 架构 [#architecture]

Livemark 是一个 Node CLI，它构建出的静态站点可以托管在任何地方。源码和输出都归你所有。

Mintlify 是托管式 SaaS。你把 MDX 和 `mint.json` 配置提交到 Git 仓库；每次 push 后 Mintlify 拉取代码、执行构建，并通过 `<your-subdomain>.mintlify.app` 或自定义域名提供服务。构建流水线和运行时都由平台管理，用户无法自行安装。

Livemark 对内容布局没有限制：它按 glob 扫描（`livemark.config.ts` 中的 `include`/`exclude`），每篇文章的 URL 由前置元数据 frontmatter 中的 `path:` 字段决定，而不是由文件位置决定。不强制要求 `docs/` 文件夹——项目可以从 `README.md`、`docs/`、`blog/`、各个包的 README 或其他任何地方获取文章。Mintlify 要求文件树与 `mint.json` 中的 `navigation` 块一致；路由对应已配置内容根目录下的文件路径。

## 内容能力 [#content-surface]

两者都支持带 frontmatter 和嵌入组件的 Markdown + MDX。

Mintlify 内置一组固定的组件（`<Card>`、`<Accordion>`、`<Tabs>`、`<Steps>`……），供作者在 MDX 中组合使用。你不需要为文档 UI 编写自己的 React 组件——直接使用 Mintlify 提供的基础组件即可。

Livemark 的指令（`:::card`、`:::tab`、`:::steps`）通过 Livemark 的组件层生成同类 UI，你可以通过 `.livemark/components/` 覆盖这些组件。

Mintlify 的 `mint.json` 在一个声明式文件中配置导航、品牌和集成。Livemark 用 `livemark.config.ts` 承担相同的角色，并通过 `.livemark/` 覆盖层实现逐文件定制。

## 功能对比 [#feature-matrix]

| 能力             | Livemark                     | Mintlify                  |
| ---------------- | ---------------------------- | ------------------------- |
| 版本管理         | 部分支持（栏目或按分支部署） | 是（内置）                |
| 国际化（i18n）   | 是（内置）                   | 是（内置）                |
| 搜索             | 是（Orama，客户端）          | 是（内置，AI 驱动）       |
| AI 聊天 / 智能体 | 否                           | 是（内置）                |
| 数据分析         | 否（自行接入）               | 是（内置仪表盘）          |
| OpenAPI 渲染     | 否                           | 是（内置）                |
| 博客             | 是（内置栏目类型）           | 是（更新日志 / 新闻页面） |
| 站点地图         | 是                           | 是                        |
| RSS              | 是（每个博客栏目）           | 是（更新日志订阅源）      |
| 主题             | 通过 `.livemark/` 覆盖组件   | 通过 `mint.json` 配置主题 |
| 自定义路由       | `.livemark/routes/`          | 否（仅内容）              |
| 自托管           | 是                           | 否                        |

## 输出与部署 [#output--deployment]

Livemark 构建出一个静态目录，可部署到任何托管平台——参见[部署](/zh/deployment/)。

Mintlify 的部署由 Mintlify 负责。你无需自行构建或托管输出；平台通过其 CDN 提供渲染后的站点，并负责 TLS、域名和预览。离开 Mintlify 意味着要重写内容或将其迁移到别处。

## 另请参阅 [#see-also]

- [编写](/zh/authoring/)——Livemark 的 Markdown 能力。
- [定制](/zh/customization/)——Livemark 的配置项与组件覆盖。
- [对比](/zh/comparison/)——返回索引。
