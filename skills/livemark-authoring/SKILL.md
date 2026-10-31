---
name: livemark-authoring
description: Use when adding or editing Markdown articles in a Livemark project — covers file placement under include globs, frontmatter fields, sidebar order, URL derivation, images/assets, and the patches mechanism for files that can't carry frontmatter.
---

# Livemark Authoring

Guidance for writing and maintaining Markdown content in a Livemark project.

## When to use this skill

Invoke when the user asks to:

- Add a new article, page, or docs section.
- Rename, reorder, hide, or nest an existing article.
- Set metadata (title, icon, tags, date, author, OG image).
- Patch a file (typically `README.md`) that needs Livemark metadata without dirtying its upstream rendering.

## Where articles live

- Livemark collects Markdown files that match the `include` glob(s) in `livemark.config.ts`. The default project layout is `docs/**/*.md`. Respect existing convention in the repo.
- Files ending in `.md` are supported by default. A `.md` file compiles as plain Markdown (any `{` or `<` in prose is safe; raw HTML renders as HTML, `class` not `className`); a `.mdx` file, or `format: "mdx"`, compiles as MDX with JSX and `{expressions}`. Drafts/partials can be co-located but excluded via the `exclude` glob (e.g. `docs/**/_*.md`).

## Frontmatter template

Every field is optional. Livemark derives defaults from the file itself.

```yaml
---
title: Getting Started # default: first `# ` heading, else filename
label: Start # short variant used in sidebar/breadcrumbs
description: A one-line blurb. # used in <meta description> and OG
icon: rocket # lucide icon name
order: 1 # sidebar sort; negatives pin to end
path: /getting-started/ # default: folders below the include glob's base + slugified filename
language: es # multi-language sites only; default: `.<code>.md` suffix, else the default language
sidebar: true # false hides from nav but keeps URL reachable
toc: true # false suppresses right-hand TOC
breadcrumbs: false # hides the trail above the title; default: config `breadcrumbs`, else true
image: ./cover.png # og:image (needs `site`); relative resolves against the file
author: Ada Lovelace # or [Ada Lovelace, Grace Hopper]
date: 2026-04-20 # ISO — drives blog section sort order
tags: [release, announcement] # blog-section tag pages /prefix/tags/<tag>/
sourceUrl: https://example.com/src # toolbar source link; default: GitHub edit page from git origin, none outside GitHub
format: mdx # md (plain Markdown) or mdx; default: mdx for a .mdx file, else md
---
```

## Rules of thumb

1. **One H1 per file.** Livemark uses the first `# ` for the title when frontmatter `title` is omitted. Don't add a duplicate H1 in the body if the frontmatter already sets `title`.
2. **Order is piecewise.** Positive numbers sort first ascending, unordered articles come next, negative numbers land at the end (`-1` last, `-2` second-to-last). Leave the middle alone — only set `order` on items you want pinned.
3. **URLs.** Don't set `path` unless you need to override the default. Livemark derives it from the file's folders below the include glob's static base plus its slugified name (`docs/guide/install.md` under `docs/**/*.md` → `/guide/install/`); an `index.md` names its folder. A frontmatter `path` gets its missing slashes added. Two articles at one path fail the build.
4. **Nesting.** The sidebar nests an article under the one whose `path` is its parent (`/guide/install/` under `/guide/`), so give a folder an `index.md` to head it.
5. **Translations.** On a site with `languages`, put `guide.es.md` beside `guide.md` and keep the same `path`: Livemark serves it at `/es/guide/` and pairs the two by that path. Don't add the `/es/` prefix yourself.
6. **Images.** Relative paths in `image`, Markdown `![](...)`, and MDX `<img src>` resolve against the article file — keep assets co-located or under `docs/images/`.
7. **Links between articles.** Prefer a relative link to the file, `[Install](./install.md#steps)`: Livemark points it at that article's page, honouring its `path`, and at the reader's translation. It also works on GitHub. A link to a file no article comes from stays as written and fails the build.

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

- `npx livemark build` — confirms the file prerenders without error. A file whose frontmatter fails to parse or validate fails the build, naming the file and the field; `livemark start` leaves it out of the site and shows the error in the browser instead.
- Read any `[livemark] <file>:` warning lines: a directive written `::: tip` or under an unknown name renders as plain text, and a relative image whose file is missing renders broken. Neither fails the build.
- Grep built HTML (`.livemark/build/client/<path>/index.html`) to confirm title and metadata land as intended.

## References

- Full frontmatter reference: https://livemark.dev/authoring/frontmatter/.
- Schema source of truth: `source/models/article.ts`.
- Transform pipeline: `source/actions/article/load.ts`; default paths in `source/helpers/article-path.ts`.
