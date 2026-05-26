---
title: Docsify vs Livemark
label: Docsify
description: Static site generator vs runtime Markdown renderer in the browser.
path: /comparison/docsify/
icon: wind
order: 9
---

# Docsify vs Livemark

[Docsify](https://docsify.js.org) is a documentation site tool that takes a different approach from every other entry in this section: it does not generate static HTML at build time. Instead, it ships a single `index.html` plus a JavaScript runtime that fetches Markdown files in the browser and renders them on the fly. There is no build step.

## At a glance

| Axis               | Livemark                         | Docsify                                       |
| ------------------ | -------------------------------- | --------------------------------------------- |
| Language / runtime | TypeScript / Node 24+            | Browser JavaScript (no build)                 |
| UI framework       | React 19                         | Vanilla JS + Vue-flavored template directives |
| Build tool         | Vite + TanStack Start            | None (runtime fetch + render)                 |
| Content format     | Markdown + MDX                   | Markdown (marked / Prism in the browser)      |
| License            | MIT, self-hosted                 | MIT, self-hosted                              |
| Output model       | Prerendered static (SSR-capable) | Client-rendered from raw `.md` files          |

## Architecture

Livemark builds on Vite, TanStack Start, and React. Authoring happens in JS/TS conventions (`livemark.config.ts`, npm-installable plugins, MDX components written in React). Pages are prerendered to static HTML at build time and can also run server-side.

Docsify has no build pipeline. A site is an `index.html` that loads `docsify.js` from a CDN (or `node_modules`) along with a small config object on `window.$docsify`. At runtime, the script reads the URL hash (`#/some/page`), fetches the corresponding `.md` file with `fetch()`, runs it through `marked` for Markdown parsing and `Prism` for syntax highlighting, and injects the result into the page. Navigation is hash-based by default; History API mode is opt-in but requires server rewrites.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. Docsify reads from a single source root (the directory containing `index.html`, configurable via `basePath`), and the request URL maps directly to a file path on disk — `#/guide/install` fetches `guide/install.md`. Sidebar navigation is authored manually in `_sidebar.md`; there is no auto-generated nav.

## Content surface

Both tools accept Markdown. The asymmetry is in what can be embedded and how it gets rendered.

Docsify supports plain Markdown (CommonMark via `marked`) with a handful of built-in extensions: helpers (`> [!TIP]`-style callouts via the [`docsify-tabs`](https://jhildenbiddle.github.io/docsify-tabs/) and admonition plugins), HTML pass-through, and limited Vue-template-style directives if the optional Vue compiler is loaded. There is no MDX, no frontmatter parsing by default (a plugin can add it), and no per-page React components. Plugins are registered by pushing functions into `window.$docsify.plugins`, where they hook into the lifecycle (`init`, `mounted`, `beforeEach`, `afterEach`, `doneEach`, `ready`).

Livemark accepts Markdown + MDX with full React component embedding, frontmatter as a first-class concept (`path`, `order`, `icon`, `sidebar`, `date`, `tags`), and remark/rehype plugins applied at build time.

## Feature matrix

| Capability                  | Livemark                              | Docsify                                      |
| --------------------------- | ------------------------------------- | -------------------------------------------- |
| Versioning                  | No                                    | Yes (multi-instance via `alias` config)      |
| Internationalization (i18n) | No                                    | Yes (`fallbackLanguages` + per-locale files) |
| Search                      | Yes (Orama, client-side)              | Yes (built-in full-text plugin)              |
| Blog                        | Yes (built-in section type)           | No                                           |
| Changelog                   | Yes (section type)                    | No (manual)                                  |
| Sitemap                     | Yes                                   | No (third-party plugin)                      |
| RSS                         | Yes (per blog section)                | No                                           |
| Themes                      | Component overrides via `.livemark/`  | CSS themes (`vue.css`, `buble.css`, etc.)    |
| Plugins                     | Vite plugins + remark/rehype          | Runtime JS plugins on `window.$docsify`      |
| Custom routes               | `.livemark/routes/` (TanStack Router) | No (URL maps 1:1 to file paths)              |
| Standalone toolchain        | Node + npm                            | None at runtime; `docsify-cli` for init only |

## Output & deployment

This is where the tools diverge most sharply.

Livemark produces a directory of prerendered HTML + assets (`.livemark/build/client/`). Every route is a real HTML file; crawlers, link previews, and JS-disabled clients all see the rendered content. The hosting story is the standard static-site story — see [Deployment](/deployment/) for host guides.

Docsify ships the raw `.md` files alongside `index.html`. The "deploy" is uploading the source directory to any static host. The trade-off: zero build time and edit-and-refresh authoring, at the cost of empty HTML on first paint — search engines, social previews, and no-JS clients see only the loader shell. The project documents an [SSR/prerender workflow](https://docsify.js.org/#/ssr) using `docsify-ssr` or external prerenderers to mitigate this for SEO-sensitive sites.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
