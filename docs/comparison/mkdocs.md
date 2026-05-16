---
title: MkDocs vs Livemark
label: MkDocs
description: TypeScript + React + MDX vs Python + Jinja2 + Markdown.
path: /comparison/mkdocs/
icon: book-marked
order: 7
---

# MkDocs vs Livemark

[MkDocs](https://www.mkdocs.org) is a Python-based docs generator. Content is plain Markdown, layouts are Jinja2 templates, and themes are pip-installable Python packages. The de-facto theme is [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/), which is what most consumers actually use.

## At a glance

| Axis               | Livemark                         | MkDocs                                             |
| ------------------ | -------------------------------- | -------------------------------------------------- |
| Language / runtime | TypeScript / Node 24+            | Python 3.8+                                        |
| UI framework       | React 19                         | Jinja2 templates (HTML + CSS)                      |
| Build tool         | Vite + TanStack Start            | MkDocs CLI                                         |
| Content format     | Markdown + MDX                   | Markdown (CommonMark + Python-Markdown extensions) |
| License            | MIT, self-hosted                 | BSD-2-Clause, self-hosted                          |
| Output model       | Prerendered static (SSR-capable) | Prerendered static                                 |

## Architecture

Livemark builds on Vite, TanStack Start, and React. Authoring uses JS/TS conventions (`livemark.config.ts`, npm-installable plugins, MDX components written in React).

MkDocs is a Python CLI. The site is configured through `mkdocs.yml`. Themes are pip-installable; the build pipeline runs Markdown content through Python-Markdown (or pymdown-extensions) and through Jinja2 templates. There's no JavaScript build step — interactivity in the rendered site is whatever the theme's templates emit.

Material for MkDocs adds a curated theme, a search index based on lunr.js, instant navigation, and a wide plugin ecosystem (`mkdocs-material` extras, plus the broader `mkdocs-*` plugin namespace on PyPI).

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. MkDocs reads from `docs/` (configurable via `docs_dir` in `mkdocs.yml`), with routes derived from file paths under that directory.

## Content surface

Both tools accept Markdown with frontmatter. The big asymmetry is component embedding: Livemark accepts MDX (React components in `.md`/`.mdx`); MkDocs accepts only Markdown.

MkDocs extends Markdown through Python-Markdown extensions (admonitions, tabs, footnotes, definition lists) and `pymdown-extensions` (which adds the full Material syntax: `=== "Tab 1"` tabs, `:::note` admonitions, `++ctrl++` keyboard shortcuts, etc.). Customization beyond what extensions offer requires writing a Python plugin or overriding a Jinja template.

Frontmatter shape differs: MkDocs reads `title`, `summary`, `tags` (with a plugin), `template`, and uses `mkdocs.yml` for navigation. Livemark uses `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

## Feature matrix

| Capability                  | Livemark                              | MkDocs (Material)                   |
| --------------------------- | ------------------------------------- | ----------------------------------- |
| Versioning                  | No                                    | Yes (via `mike` plugin)             |
| Internationalization (i18n) | No                                    | Yes (Material's i18n plugin)        |
| Search                      | Yes (Orama, client-side)              | Yes (built-in, client-side)         |
| Blog                        | Yes (built-in section type)           | Yes (Material's blog plugin)        |
| Changelog                   | Yes (section type)                    | No (manual)                         |
| Sitemap                     | Yes                                   | Yes                                 |
| RSS                         | Yes (per blog section)                | Via plugin                          |
| Themes                      | Component overrides via `.livemark/`  | Theme packages + Jinja overrides    |
| Plugins                     | Vite plugins + remark/rehype          | Python plugins (`mkdocs-*` on PyPI) |
| Custom routes               | `.livemark/routes/` (TanStack Router) | No (content-only)                   |
| Standalone toolchain        | Node + npm                            | Python + pip                        |

## Output & deployment

Both tools produce static HTML + assets ready for any static host. MkDocs emits to `site/` by default; Livemark emits to `.livemark/build/client/`. The hosting story is the same — see Livemark's [Deployment](/deployment/) for host guides.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
