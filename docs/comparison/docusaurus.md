---
title: Docusaurus vs Livemark
label: Docusaurus
description: Technical side-by-side of two React + MDX docs frameworks.
path: /comparison/docusaurus/
icon: book-text
order: 1
---

# Docusaurus vs Livemark

[Docusaurus](https://docusaurus.io) is an open-source docs framework maintained by Meta. It renders React + MDX content through a Webpack-based build pipeline, ships first-class versioning and internationalization, and has a large plugin ecosystem.

## At a glance

| Axis               | Livemark                         | Docusaurus            |
| ------------------ | -------------------------------- | --------------------- |
| Language / runtime | TypeScript / Node 24+            | TypeScript / Node 18+ |
| UI framework       | React 19                         | React 18              |
| Build tool         | Vite + TanStack Start            | Webpack               |
| Content format     | Markdown + MDX                   | Markdown + MDX        |
| License            | MIT, self-hosted                 | MIT, self-hosted      |
| Output model       | Prerendered static (SSR-capable) | Prerendered static    |

## Architecture

Livemark wraps Vite, TanStack Start, and React into a single zero-config CLI. Content is loaded by content-collections from globbed `.md` files, compiled to MDX at build time, and prerendered to static HTML for every route.

Docusaurus is built on Webpack. The runtime is React Router + a Docusaurus core that handles theming, plugins, and content sources. Plugins are first-class — every built-in feature (docs, blog, pages, search) is itself a plugin, and third parties extend the system the same way.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. Docusaurus's docs plugin expects a `docs/` directory (configurable via `path`, but folder-based rather than glob-based).

## Content surface

Both tools accept Markdown and MDX with frontmatter. Both let you embed React components inside `.md`/`.mdx` files.

Livemark's directives (`:::card`, `:::tip`, `:::tab`, …) are processed by remark plugins shipped in the package. Docusaurus uses MDX components plus an `admonition` extension for callouts.

Frontmatter shape differs: Livemark uses `path`, `order`, `icon`, `sidebar`, `date`, `tags`. Docusaurus uses `id`, `slug`, `sidebar_position`, `sidebar_label`, `tags`.

## Feature matrix

| Capability                  | Livemark                                      | Docusaurus                             |
| --------------------------- | --------------------------------------------- | -------------------------------------- |
| Versioning                  | No                                            | Yes (built-in)                         |
| Internationalization (i18n) | No                                            | Yes (built-in)                         |
| Search                      | Yes (Orama, client-side)                      | Algolia DocSearch integration          |
| Blog                        | Yes (built-in section type)                   | Yes (built-in plugin)                  |
| Changelog                   | Yes (section type, splits by version heading) | No (community plugins)                 |
| Sitemap                     | Yes                                           | Yes                                    |
| RSS                         | Yes (per blog section)                        | Yes (for blog plugin)                  |
| Themes                      | Component overrides via `.livemark/`          | Theme packages (`@docusaurus/theme-*`) |
| Plugins                     | Vite plugins + remark/rehype                  | First-class plugin API                 |
| Custom routes               | `.livemark/routes/` (TanStack Router)         | Plugin-defined routes                  |

## Output & deployment

Livemark prerenders every route to disk at `.livemark/build/client/` — see [Deployment](/deployment/) for host-specific guides.

Docusaurus also prerenders to static HTML, output at `build/`. The static output works on any of the same hosts (GitHub Pages, Cloudflare, Vercel, Netlify, static hosting). Docusaurus's built-in i18n produces separate output trees per locale.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
