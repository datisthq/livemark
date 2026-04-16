---
title: Sections and Blog Support
description: Introducing configurable sections and blog support in Livemark
author: Livemark Team
date: 2026-04-15
pathname: /blog/sections-and-blog-support/
tags: [features, announcement]
---

# Sections and Blog Support

We just shipped two major features: configurable sections and blog support.

## Sections

You can now split your site into multiple sections. Each section appears as a tab in the header, and the sidebar shows only articles from the active section.

```ts
export default defineConfig({
  sections: [
    { title: "Docs", pathname: "/" },
    { title: "Blog", pathname: "/blog/", type: "blog" },
  ],
})
```

## Blog

Blog sections get a different sidebar layout optimized for chronological posts, and an auto-generated index page listing all posts by date.
