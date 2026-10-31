---
title: 链接
path: /authoring/links/
icon: link
order: 3
---

# 链接

## 内部链接 {#internal-links}

链接到文档中的其他页面：

```md
[Getting Started](/introduction/)
```

渲染效果：[快速上手](/zh/introduction/)

## 外部链接 {#external-links}

链接到外部资源：

```md
[GitHub](https://github.com)
```

渲染效果：[GitHub](https://github.com)

## 锚点链接 {#anchor-links}

链接到某个标题：在当前页面只需写 `#id`，在其他页面则写在该页面路径之后：

```md
[See Auto Links](#auto-links)
[See Custom Heading IDs](/zh/authoring/headings/#custom-ids)
```

渲染效果：[查看自动链接](#auto-links) 和 [查看自定义标题 ID](/zh/authoring/headings/#custom-ids)

## 链接到 Markdown 文件 {#links-to-markdown-files}

像在 GitHub 上一样，按文件链接到另一篇文章，路径相对于当前文件。链接会指向由该文件生成的页面（遵循其 `path`），并为其他语言的读者指向对应的译文：

```md
[Headings](./headings.md)
[Custom IDs](./headings.md#custom-ids)
```

渲染效果：[标题](./headings.md) 和 [自定义 ID](./headings.md#custom-ids)

指向没有对应文章的 Markdown 文件的链接会保持原样，并在构建时作为失效链接报错。

## 自动链接 {#auto-links}

URL 会被自动转换为链接：

```md
https://github.com/datisthq/livemark
```

渲染效果：https://github.com/datisthq/livemark
