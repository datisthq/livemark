---
description: Organize articles into Docs, Blog, and Changelog sections.
path: /customization/article-sections/
icon: layout-panel-left
order: 5
---

# Article Sections

A section is a group of articles that share a URL prefix, a sidebar, and a navigation tab. Livemark ships three section types:

- **Article** — the default. A tree of articles with a collapsible sidebar.
- **Blog** — date-sorted posts with tags and an auto-generated index.
- **Changelog** — a single source file (or GitHub releases) split into per-version articles.

## Basic usage

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

When `sections` is omitted, all articles render into a single default section — useful for small sites.

## Common fields

Every section, regardless of type, accepts:

| Field      | Type                                 | Default     | Purpose                                                                                         |
| ---------- | ------------------------------------ | ----------- | ----------------------------------------------------------------------------------------------- |
| `title`    | `string`                             | —           | Label for the section tab and sidebar header.                                                   |
| `prefix`   | `string`                             | —           | URL prefix (e.g. `/`, `/blog/`, `/changelog/`). Articles with matching `path`s are routed here. |
| `type`     | `"article" \| "blog" \| "changelog"` | `"article"` | Section type.                                                                                   |
| `icon`     | `string`                             | type-based  | Lucide icon shown next to the title.                                                            |
| `position` | `"header" \| "sidebar"`              | `"header"`  | Where the section tab renders.                                                                  |

## Article sections

Plain docs. Sidebar shows the article tree. This is the default — you can omit `type` entirely:

```typescript
{ title: "Docs", prefix: "/" }
```

## Blog sections

Blog sections sort articles by `date` (newest first), render an auto-generated index at the section prefix, and expose per-tag pages.

```typescript
{
  title: "Blog",
  prefix: "/blog/",
  type: "blog",
}
```

Then in each post:

```yaml
---
title: Announcing v0.3
date: 2026-04-15
tags: [announcement, release]
---
```

Livemark auto-generates:

- `/blog/` — index listing all posts, newest first.
- `/blog/tags/<tag>/` — one page per tag.

## Changelog sections

A changelog section reads from a `source` file. When `version: true`, Livemark splits the file into one article per semver heading.

```typescript
{
  title: "Changelog",
  prefix: "/changelog/",
  type: "changelog",
  source: "CHANGELOG.md",
  version: true,
}
```

With `version: true`, top-level semver headings like `## 0.3.0 — 2026-04-01` become individual articles at `/changelog/0-3-0/`. The section header in the site chrome shows the latest version in parentheses.

Changelog-specific fields:

| Field     | Type      | Default | Purpose                                                           |
| --------- | --------- | ------- | ----------------------------------------------------------------- |
| `source`  | `string`  | —       | Path to the changelog source file, relative to your project root. |
| `version` | `boolean` | `false` | If true, split `source` into per-version articles.                |

## Ordering and matching

Article paths are matched to sections by longest-prefix wins. Given `/blog/2024/launch/` and sections with prefixes `/` and `/blog/`, the article is placed in `/blog/`.

Keep prefixes trailing-slashed (`/blog/`, not `/blog`) for predictable matching.

## See also

- [External Links](/customization/external-links/) — add external links next to your section tabs.
- [Frontmatter](/markdown/frontmatter/) — the `path`, `order`, `group`, `date`, `tags` fields that drive section content.
