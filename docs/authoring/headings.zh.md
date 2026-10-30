---
title: 标题
path: /authoring/headings/
icon: heading
order: 2
---

# 标题

标题会自动生成用于链接的锚点 ID。

## 自动生成的 ID {#auto-generated-ids}

```md
## My Heading
```

渲染为 `<h2 id="my-heading">My Heading</h2>`。ID 采用与 GitHub 兼容的 slug 规则生成。

## 自定义标题 ID {#custom-ids}

使用 `{#custom-id}` 语法覆盖自动生成的 ID：

```md
## My Heading {#custom-id}
```

这会生成 `<h2 id="custom-id">My Heading</h2>`。使用 `#custom-id` 链接到它。本标题自身就使用了 `{#custom-ids}`。

## 标题层级 {#heading-levels}

使用 h2–h4 组织内容结构。h1 保留给页面标题。

更深层级的标题（h5、h6）也受支持，但不会出现在目录中。

## 目录控制 {#toc-control}

使用注解控制标题是否出现在目录中。

将标题从目录中隐藏，同时在渲染结果中保持可见：

```md
## Visible Heading [!toc]
```

该标题会在页面上正常渲染，但不会出现在目录中。

创建仅用于目录的标题，它会出现在目录中，但不会出现在渲染结果中：

```md
## Hidden Heading [toc]
```

该标题会出现在目录中用于导航，但会从页面内容中移除。

## 悬停时显示锚点链接 {#anchor-links-on-hover}

带有 ID 的标题在鼠标悬停时会显示一个链接图标。标题文字本身就是指向其锚点的链接：点击后，地址栏中就是可以分享的 URL。

## 行内目录 {#inline-table-of-contents}

使用 `::toc` 指令在内容中的任意位置插入目录：

```md
::toc
```

使用 `maxLevel` 限制深度：

```md
::toc{maxLevel=2}
```

渲染效果：

::toc{maxLevel=2}
