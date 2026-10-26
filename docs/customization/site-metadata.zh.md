---
title: 站点元数据
description: 设置站点标题、描述、URL、logo、favicon 和横幅。
path: /customization/site-metadata/
icon: globe
order: 2
---

# 站点元数据

`livemark.config.ts` 中的几个顶层字段负责向浏览器、搜索引擎和社交卡片描述你的站点。

## 字段 [#fields]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  site: "https://example.com",
  title: "My Docs",
  description: "Everything you need to build things.",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
  banner: "v2 is out · [Read the release notes](/blog/v2/)",
  head: { meta: [{ name: "twitter:site", content: "@me" }] },
})
```

| 字段          | 类型     | 默认值                      | 显示位置                                                |
| ------------- | -------- | --------------------------- | ------------------------------------------------------- |
| `site`        | `string` | —                           | sitemap 和绝对 URL 使用的规范源地址                     |
| `title`       | `string` | `"Livemark"`                | `<title>`、Open Graph 的 `og:title`、顶栏中的站点标题   |
| `description` | `string` | `"Markdown site generator"` | `<meta name="description">`、`og:description`           |
| `logo`        | `string` | —                           | 顶栏中站点标题旁的图片（也作为默认 favicon）            |
| `favicon`     | `string` | `logo ?? bundled default`   | 浏览器标签页图标                                        |
| `banner`      | `string` | —                           | 每个页面顶栏上方的公告横条                              |
| `head`        | `object` | —                           | 每个页面 `<head>` 中额外的 `meta`、`links` 和 `scripts` |

## Sitemap 与 `site` [#sitemap-and-site]

如果设置了 `site`，Livemark 会在 `docs:build` 期间于输出目录根部生成 `sitemap.xml`，并以 `site` 作为每个 URL 的绝对源地址。未设置 `site` 时，会跳过 sitemap 的生成。

## Logo 与 favicon [#logo-and-favicon]

- `logo` 和 `favicon` 接受任意 URL 或相对于根路径的路径（`/logo.svg`）。放在 `.livemark/public/` 中的资源会在 `/…` 下提供，很适合用在这里。
- 如果省略 `favicon`，Livemark 会回退到 `logo`，最后回退到其内置的标志。
- MIME 类型根据扩展名（`.svg`、`.png`、`.ico`）推断。

:::tip
`logo` 文件请尽量小（SVG 最理想）。它会内联到每个页面的顶栏中。
:::

## 横幅 [#banner]

`banner` 会在每个页面的顶栏上方显示一条全宽横条；页面滚动时它会滚走，而顶栏保持固定。其值是行内 Markdown（链接、`**bold**`、`_emphasis_` 和 `` `code` ``），因此一行公告无需任何自定义组件：

```typescript title="livemark.config.ts"
banner: "Livemark is in technical preview · [Share feedback →](https://github.com/datisthq/livemark/discussions)",
```

- 绝对链接会在新标签页中打开；相对于根路径的链接会加上你的 `base` 前缀。
- 原始 HTML 标签会被丢弃。如需图标或自定义标记，请改为 escape `components/Banner.tsx`（[覆盖（escape）](/zh/customization/overriding-escaping/)）。
- 横条使用 `--banner` 和 `--banner-foreground` 颜色令牌。

## 页面级标签 [#per-page-tags]

每个文章页面都会用自己的 `<title>`、`description`、`og:title`、`og:description` 和 `og:type`（`article`）覆盖站点默认值。设置了 `site` 时，它还会获得 `og:url`、`<link rel="canonical">`，以及根据 frontmatter 中的 `image` 生成的绝对 `og:image`。

## 额外的 head 标签 [#extra-head-tags]

`head` 会在默认标签之后向每个页面添加标签。`name` 或 `property` 与某个默认标签相同的 `meta` 条目会替换该默认标签：

```typescript title="livemark.config.ts"
export default defineConfig({
  head: {
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "abc123" },
    ],
    links: [{ rel: "me", href: "https://mastodon.social/@me" }],
    scripts: [{ src: "https://example.com/analytics.js", defer: "" }],
  },
})
```

要删除或改写某个默认标签，请 escape `head.ts`，并修改 `customizeHead` 的返回值：

```typescript title=".livemark/head.ts"
import type { RootHead } from "livemark"

export function customizeHead(head: RootHead) {
  head.meta = head.meta.filter(m => m.property !== "og:site_name")
  return head
}
```

## 另请参阅 [#see-also]

- [外部链接](/zh/customization/external-links/)：位于标题旁边的顶栏/侧边栏链接。
- [文章栏目](/zh/customization/article-sections/)：组织站点本身的内容结构。
