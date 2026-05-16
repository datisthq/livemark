---
name: livemark-authoring
description: Use when adding or editing Markdown articles in a Livemark project — covers file placement under include globs, frontmatter fields, sidebar grouping, URL derivation, images/assets, and the patches mechanism for files that can't carry frontmatter.
---

# Livemark Authoring

Guidance for writing and maintaining Markdown content in a Livemark project.

## When to use this skill

Invoke when the user asks to:

- Add a new article, page, or docs section.
- Rename, reorder, hide, or regroup an existing article.
- Set metadata (title, icon, tags, date, author, OG image).
- Patch a file (typically `README.md`) that needs Livemark metadata without dirtying its upstream rendering.

## Where articles live

- Livemark collects Markdown files that match the `include` glob(s) in `livemark.config.ts`. The default project layout is `docs/**/*.md`. Respect existing convention in the repo.
- Files ending in `.md` are supported by default. Drafts/partials can be co-located but excluded via the `exclude` glob (e.g. `docs/**/_*.md`).

## Frontmatter template

Every field is optional. Livemark derives defaults from the file itself.

```yaml
---
title: Getting Started # default: first `# ` heading, else filename
label: Start # short variant used in sidebar/breadcrumbs
description: A one-line blurb. # used in <meta description> and OG
icon: rocket # lucide icon name
order: 1 # sidebar sort; negatives pin to end
group: Docs # sidebar section label
path: /getting-started/ # default: slugified filename + leading/trailing slashes
sidebar: true # false hides from nav but keeps URL reachable
toc: true # false suppresses right-hand TOC
image: ./cover.png # OG/social card; relative resolves against the file
author: Ada Lovelace # or [Ada Lovelace, Grace Hopper]
date: 2026-04-20 # ISO — drives blog section sort order
tags: [release, announcement] # blog-section tag pages /prefix/tags/<tag>/
---
```

## Rules of thumb

1. **One H1 per file.** Livemark uses the first `# ` for the title when frontmatter `title` is omitted. Don't add a duplicate H1 in the body if the frontmatter already sets `title`.
2. **Order is piecewise.** Positive numbers sort first ascending, unordered articles come next, negative numbers land at the end (`-1` last, `-2` second-to-last). Leave the middle alone — only set `order` on items you want pinned.
3. **Grouping.** Contiguous root-level articles with the same `group` string render under a labelled sidebar section. Mixing groups breaks visual grouping.
4. **URLs.** Don't set `path` unless you need to override the default slug. Livemark derives `path` from the filename plus leading/trailing slashes.
5. **Images.** Relative paths in `image`, Markdown `![](...)`, and MDX `<img src>` resolve against the article file — keep assets co-located or under `docs/images/`.

## Patching a file you can't touch

When a file already lives on disk (for example `README.md` that GitHub renders) and you don't want to pollute it with frontmatter, inject metadata via `patches` in `livemark.config.ts`:

```ts
patches: [
  {
    file: "README.md",
    article: { title: "Overview", icon: "sparkles", order: 0 },
  },
]
```

The `file` field is exact-match on the collection-relative path. `content` cannot be patched — zod rejects at config load.

## Blog posts

For a blog section:

```yaml
---
title: "Announcing v0.3"
date: 2026-04-20
author: Livemark Team
tags: [release, announcement]
image: ./images/v0-3.png
description: What's new in 0.3, in 400 words.
---
```

`date` is required for correct chronological sort. `tags` drive the `/<prefix>/tags/<tag>/` pages.

## Verification

After authoring, run:

- `pnpm docs:build` — confirms the file prerenders without error.
- Grep built HTML (`.livemark/build/client/<path>/index.html`) to confirm title and metadata land as intended.

## References

- Full frontmatter reference: `docs/authoring/frontmatter.md`.
- Schema source of truth: `website/models/article.ts`.
- Transform pipeline: `website/content-collections.ts`.
