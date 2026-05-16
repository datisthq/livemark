---
title: Nextra vs Livemark
label: Nextra
description: Vite + TanStack Start vs Next.js with the established theme-package model.
path: /comparison/nextra/
icon: square-stack
order: 6
---

# Nextra vs Livemark

[Nextra](https://nextra.site) is a Next.js docs framework with a theme-package architecture. It originated on the Pages Router and has migrated to support the App Router as well. Documentation sites pick a theme (`nextra-theme-docs` for docs, `nextra-theme-blog` for blogs) and configure it.

## At a glance

| Axis               | Livemark                         | Nextra                        |
| ------------------ | -------------------------------- | ----------------------------- |
| Language / runtime | TypeScript / Node 24+            | TypeScript / Node 18+         |
| UI framework       | React 19                         | React 18/19 (Next.js)         |
| Build tool         | Vite + TanStack Start            | Next.js (Turbopack/Webpack)   |
| Content format     | Markdown + MDX                   | Markdown + MDX                |
| License            | MIT, self-hosted                 | MIT, self-hosted              |
| Output model       | Prerendered static (SSR-capable) | Static or SSR (Next.js modes) |

## Architecture

Livemark is a Vite + TanStack Start CLI: one tool, one config file, content in `.md` files.

Nextra is a layer on top of an existing Next.js application. Setup involves installing `nextra` and a theme package, wiring them into `next.config.js`, and defining navigation in a `_meta.json` (Pages Router) or `meta.js` (App Router) file per directory. The theme package owns the entire UI; customization happens through the theme's documented hooks.

`nextra-theme-docs` is the documentation theme used by Vercel, SWR, Turbo, and many others. It's stable, maintained, and feature-complete for docs use cases.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. Nextra reads content from `pages/` (Pages Router) or `content/` (App Router) with routes determined by file paths and `_meta.json` files alongside.

## Content surface

Both tools accept Markdown + MDX with frontmatter and embedded React components.

Nextra supports remote MDX via `next-mdx-remote`, KaTeX/Mermaid through plugins, and image optimization through Next's `<Image>` component.

Frontmatter shape differs: Nextra uses `title`, `description`, `searchable`, `hide_title`, plus per-directory `_meta.json` for navigation. Livemark uses inline frontmatter for everything (`path`, `order`, `icon`, `sidebar`, `date`, `tags`) and a single `livemark.config.ts` for site-level navigation.

## Feature matrix

| Capability                  | Livemark                              | Nextra                                               |
| --------------------------- | ------------------------------------- | ---------------------------------------------------- |
| Versioning                  | No                                    | No (community workarounds)                           |
| Internationalization (i18n) | No                                    | Yes (via Next i18n + Nextra hooks)                   |
| Search                      | Yes (Orama, client-side)              | Yes (FlexSearch built-in, optional Algolia/Pagefind) |
| Blog                        | Yes (built-in section type)           | Yes (`nextra-theme-blog`)                            |
| Changelog                   | Yes (section type)                    | No (community plugins)                               |
| Sitemap                     | Yes                                   | Via Next.js `sitemap.ts`                             |
| RSS                         | Yes (per blog section)                | Yes (blog theme), via Next routes for docs           |
| Themes                      | Component overrides via `.livemark/`  | Theme packages; customize via theme config           |
| Custom routes               | `.livemark/routes/` (TanStack Router) | Any Next page/route                                  |
| Standalone CLI              | Yes (`livemark build`)                | No (Next.js commands)                                |

## Output & deployment

Livemark prerenders every route at build time — output at `.livemark/build/client/`, deploy to any static host (see [Deployment](/deployment/)).

Nextra inherits Next.js's output modes. The most common docs setup is full static export (`output: 'export'`), which produces a static directory deployable anywhere. SSR setups target Vercel or Node hosts.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
