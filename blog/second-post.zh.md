---
title: 栏目与博客支持
description: 在 Livemark 中引入可配置的栏目和博客支持
author: Livemark Team
date: 2026-04-15
path: /blog/sections-and-blog-support/
tags: [features, announcement]
---

# 栏目与博客支持

我们刚刚发布了两项重要功能：可配置的栏目和博客支持。

## 栏目 {#sections}

现在你可以把站点拆分为多个栏目。每个栏目在顶栏中显示为一个标签页，侧边栏只显示当前栏目中的文章。

```ts
export default defineConfig({
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
  ],
})
```

## 博客 {#blog}

博客栏目使用一种不同的侧边栏布局，专为按时间排列的文章优化，并会自动生成一个按日期列出所有文章的索引页。
