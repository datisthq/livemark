---
description: Split a section's sidebar into labelled groups using the `group` field.
path: /customization/article-groups/
icon: folder-tree
order: 6
---

# Article Groups

Within a [section](/customization/article-sections/) you can split the sidebar into named groups by setting the `group` field in an article's frontmatter. Articles that share a `group` value render under one labelled heading; articles without a `group` stay in the unnamed leading group at the top.

## When to use it

Use groups when a single section contains topical clusters that benefit from a visual divider — e.g. "Getting Started" / "Guides" / "Reference" inside a docs section, or "Recipes" / "Patterns" inside a longer guide. If your content cleanly splits into separate URL prefixes instead, reach for [Article Sections](/customization/article-sections/).

## Basic usage

Add `group: <label>` to the frontmatter of any article. Articles with the same label group together; the label appears as the sidebar heading.

```md title="docs/setup.md"
---
group: Setup
order: 1
---

# Installation

…
```

```md title="docs/guides/auth.md"
---
group: Guides
order: 1
---

# Authentication

…
```

In the sidebar:

```text
SETUP
  • Installation
  • Configuration
GUIDES
  • Authentication
  • Caching
```

## How groups are formed

A group is a **contiguous run** of root-level articles that share the same `group` value, walked in `order` (then alphabetical fallback) order. Concretely:

- The first article without a `group` opens an unnamed leading group.
- The first article with `group: X` starts the "X" group.
- Adjacent articles with the same value extend the current group.
- A different value (or none) starts a new group.

Groups are not nested — `group` only affects root-level articles. Children of an article (sub-pages under it) follow the parent's group.

## Ordering between groups

The order of groups is determined by the `order` of the **first article** in each group. So if "Guides" should come before "Reference", make sure the first Guides article has a lower `order` than the first Reference article.

```md title="docs/auth.md"
---
group: Guides
order: 1     # opens "Guides"
---
```

```md title="docs/api.md"
---
group: Reference
order: 10    # opens "Reference" — comes after "Guides"
---
```

## With patches

If you don't want the `group` value living inside a markdown file (for example, a `README.md` that's also rendered by GitHub), set it via [Article Patches](/customization/article-patches/) in your config:

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: ["docs/**/*.md", "README.md"],
  patches: [
    {
      file: "README.md",
      article: {
        title: "Introduction",
        group: "Articles",
        order: 1,
      },
    },
  ],
})
```

## See also

- [Article Sections](/customization/article-sections/) — split content across separate URL prefixes when groups aren't enough.
- [Article Patches](/customization/article-patches/) — set `group` from config without editing the file.
- [Frontmatter](/markdown/frontmatter/) — every field you can set on an article.
