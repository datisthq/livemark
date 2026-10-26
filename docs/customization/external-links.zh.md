---
description: 在顶栏或侧边栏中添加外部 URL。
path: /customization/external-links/
icon: external-link
order: 5
---

# 外部链接

`links` 数组将外部 URL 添加到顶栏或侧边栏。每一项都渲染为一个链接，可附带图标。

## 基本用法 [#basic-usage]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  links: [
    {
      url: "https://github.com/acme/docs",
      title: "GitHub",
      icon: "github",
    },
  ],
})
```

## 字段 [#fields]

| 字段       | 类型                    | 默认值     | 用途                                                |
| ---------- | ----------------------- | ---------- | --------------------------------------------------- |
| `url`      | `string`                | —          | 外部 URL。                                          |
| `title`    | `string`                | —          | 显示的文字。                                        |
| `icon`     | `string`                | —          | Lucide 图标名（例如 `github`、`twitter`、`mail`）。 |
| `prefix`   | `string`                | —          | 栏目路径前缀；设置后，链接只在该栏目中显示。        |
| `position` | `"header" \| "sidebar"` | `"header"` | 链接的渲染位置。                                    |

图标来自 [lucide-react](https://lucide.dev/icons)。请使用 kebab-case 名称。

## 顶栏链接 [#header-links]

默认情况下，链接渲染在顶栏中栏目标签页的右侧，并会自动附加一个外部链接图标。

```typescript
links: [
  { url: "https://github.com/acme/docs", title: "GitHub", icon: "github" },
  { url: "https://twitter.com/acme", title: "Twitter", icon: "twitter" },
]
```

## 侧边栏链接 [#sidebar-links]

设置 `position: "sidebar"`，即可将链接渲染在左侧边栏中、栏目树的下方。

```typescript
links: [
  {
    url: "https://github.com/acme/docs/edit/main",
    title: "Edit on GitHub",
    icon: "pencil",
    position: "sidebar",
  },
]
```

## 将链接限定在某个栏目 [#scoping-a-link-to-a-section]

使用 `prefix`，可以让链接只在特定栏目处于激活状态时显示。这适用于按栏目设置的 “在 GitHub 上编辑” 或 “报告问题” 等快捷入口。

```typescript
links: [
  {
    url: "https://github.com/acme/docs/edit/main/blog",
    title: "Edit on GitHub",
    icon: "pencil",
    prefix: "/blog/",
    position: "sidebar",
  },
]
```

## 另请参阅 [#see-also]

- [文章栏目](/zh/customization/article-sections/)：链接上的 `prefix` 所指向的 `prefix` 值。
- [站点元数据](/zh/customization/site-metadata/)：位于顶栏链接旁边的品牌标题和 logo。
