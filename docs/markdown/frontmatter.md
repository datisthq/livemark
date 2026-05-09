---
title: Frontmatter
path: /markdown/frontmatter/
icon: file-text
order: 1
---

# Frontmatter

YAML frontmatter at the top of each `.md` file attaches metadata to an article. Every field is optional; Livemark derives sensible defaults from the file itself when a field is missing.

```yaml
---
title: Getting Started
description: Your first Livemark project, in ten minutes.
icon: rocket
order: 1
---
```

## Article metadata

Identity and presentation of the article.

| Field         | Type                 | Default                          | Purpose                                                                                             |
| ------------- | -------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `title`       | `string`             | First `#` heading, else filename | Browser tab title, article heading, navigation label.                                               |
| `label`       | `string`             | `title`                          | Short variant used in sidebar/breadcrumbs when `title` is long.                                     |
| `description` | `string`             | —                                | `<meta name="description">` and Open Graph description.                                             |
| `icon`        | `string`             | —                                | Lucide icon name (e.g. `rocket`, `book-open`). Articles without an icon render with no icon at all. |
| `image`       | `string`             | —                                | Open Graph / social card image. Relative paths resolve against the file.                            |
| `author`      | `string \| string[]` | —                                | One or more author names.                                                                           |
| `date`        | `string`             | —                                | ISO date. Drives sort order in blog sections.                                                       |
| `tags`        | `string[]`           | —                                | Used by blog sections to build `/tags/<tag>/` pages.                                                |

## Sidebar settings

How the article shows up in the left-hand navigation.

| Field     | Type      | Default                 | Purpose                                                        |
| --------- | --------- | ----------------------- | -------------------------------------------------------------- |
| `order`   | `number`  | — (unordered, mid-sort) | Sort position. See "Ordering rules" below.                     |
| `sidebar` | `boolean` | `true`                  | If false, the article is reachable by URL but hidden from nav. |
| `toc`     | `boolean` | `true`                  | If false, suppresses the right-hand table of contents.         |

### Ordering rules

`order` uses a two-region scheme:

- Positive `order` sorts first, ascending (`order: 1`, `2`, `3`, …).
- Articles with no `order` come next, in natural order.
- Negative `order` lands at the end, with `-1` last, `-2` second-to-last, etc.

This lets you pin "Getting Started" at the top (`order: 1`) and "FAQ" at the bottom (`order: -1`) while leaving the middle alone.

## URL

| Field  | Type     | Default                                   | Purpose                                                  |
| ------ | -------- | ----------------------------------------- | -------------------------------------------------------- |
| `path` | `string` | Slugified filename under the project root | Override the URL slug. Include leading/trailing slashes. |

## Overriding without editing

If you can't modify a file's frontmatter (for example a `README.md` that doubles as a GitHub landing), you can inject the same fields from `livemark.config.ts` via [Article Patches](/customization/article-patches/).

## See also

- [Article Sections](/customization/article-sections/) — how `order` and `date` interact with blog and changelog sections.
- [Article Patches](/customization/article-patches/) — set frontmatter from config, without touching the file.
