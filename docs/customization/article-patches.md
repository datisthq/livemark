---
description: Override article frontmatter from your config, without touching the file.
path: /customization/article-patches/
icon: pencil-ruler
order: 5
---

# Article Patches

Sometimes a markdown file doubles as both site content and a file that's read elsewhere — a `README.md` rendered by GitHub, a shared spec in another project. Adding livemark-only frontmatter to it pollutes the other view.

`patches` lets you inject frontmatter fields for a specific file from `livemark.config.ts` instead of editing the file on disk.

## Basic usage

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: ["README.md", "docs/**/*.md"],
  patches: [
    {
      file: "README.md",
      article: {
        title: "Overview",
        icon: "sparkles",
        order: 0,
      },
    },
  ],
})
```

The file on disk stays clean, but Livemark renders it as if the YAML above were at the top.

## Fields

| Field     | Type               | Purpose                                                      |
| --------- | ------------------ | ------------------------------------------------------------ |
| `file`    | `string`           | Collection-relative path, e.g. `"README.md"`, `"docs/a.md"`. |
| `article` | `Partial<Article>` | Any frontmatter fields except `content`.                     |

Matching is an exact string compare against the file path Livemark collects. If the path does not match any article, the patch is a silent no-op — handy when you're defensively patching a file that may or may not exist.

## Merge semantics

A patch's `article` fields are merged on top of the file's own frontmatter. Anything you don't specify in the patch keeps its normal value (from the file, or from Livemark's automatic defaults).

So a README with no frontmatter plus:

```typescript
{ file: "README.md", article: { title: "Overview" } }
```

renders as an article titled "Overview". All other fields (description, icon, path, etc.) fall back to their defaults.

## What you can't patch

The `content` key is rejected at config load time:

```typescript
// Throws at startup:
{ file: "README.md", article: { content: "replaced" } }
```

Patches are for metadata; the content of the file is always the content of the file.

## See also

- [Frontmatter](/authoring/frontmatter/) — all the fields you can set, whether inline or via a patch.
- [Configuration](/customization/config-file/) — the `include` glob that decides which files a patch can match.
