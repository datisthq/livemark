---
description: 将文章组织为文档、博客和更新日志栏目。
path: /customization/article-sections/
icon: layout-panel-left
order: 3
---

# 文章栏目

栏目是一组共享 URL 前缀、侧边栏和导航标签的文章。Livemark 内置三种栏目类型，外加一种只作为标签页的自定义类型：

- **Article**：默认类型。一棵带有可折叠侧边栏的文章树。
- **Blog**：按日期排序的文章，带有标签和自动生成的索引页。
- **Changelog**：单个源文件（或 GitHub releases），按版本拆分为多篇文章。
- **Custom**：链接到任意 URL（内部或外部）的标签页，自身不包含文章。

## 基本用法 [#basic-usage]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://example.com",
  include: ["docs/**/*.md", "blog/**/*.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "CHANGELOG.md",
      version: true,
    },
  ],
})
```

省略 `sections` 时，所有文章都渲染到一个默认栏目中，适合小型站点。

## 通用字段 [#common-fields]

无论哪种类型，每个栏目都接受以下字段：

| 字段              | 类型                                             | 默认值      | 用途                                                                                                         |
| ----------------- | ------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------ |
| `title`           | `string`                                         | —           | 栏目标签页和侧边栏标题的文字。                                                                               |
| `prefix`          | `string`                                         | —           | URL 前缀（例如 `/`、`/blog/`、`/changelog/`）。`path` 与之匹配的文章会路由到这里。除 `custom` 外的所有类型。 |
| `type`            | `"article" \| "blog" \| "changelog" \| "custom"` | `"article"` | 栏目类型。                                                                                                   |
| `icon`            | `string`                                         | —           | 显示在标题旁的 Lucide 图标。未设置时标签页不显示图标。                                                       |
| `position`        | `"header" \| "sidebar"`                          | `"header"`  | 栏目标签页的渲染位置。                                                                                       |
| `siteTitle`       | `string`                                         | —           | 处于该栏目时，替换侧边栏标题和面包屑中的站点 `title`，并作为其 RSS 订阅源的标题。                            |
| `siteDescription` | `string`                                         | —           | 处于该栏目时，替换侧边栏标题中的站点 `description`，并作为其 RSS 订阅源的描述。                              |
| `siteLink`        | `string`                                         | 首页        | 处于该栏目时站点标题链接的目标：内部路径或绝对 URL。                                                         |

当顶栏中的栏目和链接放不下时，搜索框会先缩成一个图标，仍然放不下的项则收进 **More** 菜单。

在移动端，所有栏目都会收进侧边栏。在栏目内部，它们变成一个选择器，点开后弹出底部面板：选中某个栏目后，侧边栏会显示该栏目的文章、博文或版本，而无需离开当前页面。

## 文章栏目 [#article-sections]

普通文档。侧边栏显示文章树。这是默认类型，你可以完全省略 `type`：

```typescript
{ title: "Docs", prefix: "/" }
```

## 博客栏目 [#blog-sections]

博客栏目按 `date` 对文章排序（最新的在前），在栏目前缀处渲染自动生成的索引页，并提供按标签划分的页面。

```typescript
{
  title: "Blog",
  prefix: "/blog/",
  type: "blog",
}
```

然后在每篇博文中：

```yaml
---
title: Announcing v0.3
date: 2026-04-15
tags: [announcement, release]
---
```

Livemark 会自动生成：

- `/blog/`：列出所有博文的索引页，最新的在前。
- `/blog/tags/<tag>/`：每个标签一个页面。

## 更新日志栏目 [#changelog-sections]

更新日志栏目从一个 `source` 文件读取内容，并按每个 `##` 标题将其拆分为一篇篇文章。

```typescript
{
  title: "Changelog",
  prefix: "/changelog/",
  type: "changelog",
  source: "CHANGELOG.md",
  version: true,
}
```

像 `## 0.3.0 — 2026-04-01` 这样的标题会成为位于 `/changelog/0-3-0/` 的文章，以标题的第一个词命名。设置 `version: true` 后，顶栏中的栏目标签页还会在括号中显示最新版本。

一个站点可以声明多个更新日志栏目（例如在 monorepo 中每个包一个），只要每个栏目都有自己的 `prefix`。每个栏目都会在自己的前缀下渲染各自的版本页面、在侧边栏中显示各自的版本列表和最新版本，因此两个都包含 `0.2.0` 的更新日志会并列生成 `/changelog/0-2-0/` 和 `/python/changelog/0-2-0/`。

```typescript
sections: [
  {
    title: "Changelog",
    prefix: "/changelog/",
    type: "changelog",
    source: "CHANGELOG.md",
  },
  {
    title: "Python Changelog",
    prefix: "/python/changelog/",
    type: "changelog",
    source: "python/CHANGELOG.md",
  },
]
```

更新日志专用字段：

| 字段      | 类型      | 默认值  | 用途                                         |
| --------- | --------- | ------- | -------------------------------------------- |
| `source`  | `string`  | —       | 更新日志源文件的路径，相对于项目根目录。     |
| `version` | `boolean` | `false` | 为 true 时，在顶栏标签页标题旁显示最新版本。 |

## 自定义栏目 [#custom-sections]

自定义栏目使用 `url` 而不是 `prefix`，只渲染为一个标签页。内部 URL（如 `/about/`，例如一个[自定义路由](/zh/customization/custom-routes/)）会在你访问它时高亮该标签页；绝对 URL 则打开其他站点。

```typescript
{ title: "About", type: "custom", url: "/about/" }
```

## 排序与匹配 [#ordering-and-matching]

文章路径按最长前缀优先的规则匹配到栏目。对于 `/blog/2024/launch/`，以及前缀分别为 `/` 和 `/blog/` 的栏目，该文章会被放入 `/blog/`。

前缀请保留末尾斜杠（`/blog/`，而不是 `/blog`），以便匹配结果可预测。

## 另请参阅 [#see-also]

- [外部链接](/zh/customization/external-links/)：在栏目标签页旁添加外部链接。
- [Frontmatter](/zh/authoring/frontmatter/)：决定栏目内容的 `path`、`order`、`date` 和 `tags` 字段。
