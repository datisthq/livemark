---
title: 链接
path: /authoring/links/
icon: link
order: 3
---

# 链接

## 内部链接 [#internal-links]

链接到文档中的其他页面：

```md
[Getting Started](/introduction/)
```

渲染效果：[快速上手](/zh/introduction/)

## 外部链接 [#external-links]

链接到外部资源：

```md
[GitHub](https://github.com)
```

渲染效果：[GitHub](https://github.com)

## 锚点链接 [#anchor-links]

链接到某个标题：在当前页面只需写 `#id`，在其他页面则写在该页面路径之后：

```md
[See Auto Links](#auto-links)
[See Custom Heading IDs](/zh/authoring/headings/#custom-ids)
```

渲染效果：[查看自动链接](#auto-links) 和 [查看自定义标题 ID](/zh/authoring/headings/#custom-ids)

## 自动链接 [#auto-links]

URL 会被自动转换为链接：

```md
https://github.com/datisthq/livemark
```

渲染效果：https://github.com/datisthq/livemark
