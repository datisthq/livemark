---
title: GitBook vs Livemark
label: GitBook
description: Hosted SaaS with a block editor and Git Sync vs file-based, self-hosted static docs.
path: /comparison/gitbook/
icon: notebook-pen
order: 10
---

# GitBook vs Livemark

[GitBook](https://www.gitbook.com) is a commercial hosted documentation platform. Authoring happens in a browser-based block editor (Notion-flavored), content lives in GitBook's database, and publishing is to GitBook-hosted sites under `gitbook.io` or a custom domain. A Git Sync feature can mirror that database to and from a GitHub/GitLab repository as Markdown, but the source of truth is GitBook itself, not the repo.

The older open-source `gitbook-cli` static generator was deprecated in 2018 and is unrelated to today's product; this page covers the current hosted platform.

## At a glance

| Axis               | Livemark                         | GitBook                                                           |
| ------------------ | -------------------------------- | ----------------------------------------------------------------- |
| Language / runtime | TypeScript / Node 24+            | Hosted SaaS (no local runtime)                                    |
| UI framework       | React 19                         | Proprietary (rendered by GitBook)                                 |
| Build tool         | Vite + TanStack Start            | None (no user-side build)                                         |
| Content format     | Markdown + MDX                   | Block model in editor; GitBook-flavored Markdown via Git          |
| License            | MIT, self-hosted                 | Proprietary; free tier + paid plans; self-host on Enterprise only |
| Output model       | Prerendered static (SSR-capable) | Hosted on GitBook infrastructure                                  |

## Architecture

Livemark builds on Vite, TanStack Start, and React. Authoring uses JS/TS conventions (`livemark.config.ts`, npm-installable plugins, MDX components written in React) and pages are prerendered to static HTML at build time.

GitBook is a multi-tenant SaaS. Content is authored in a block-based WYSIWYG editor: each paragraph, heading, code block, hint, or embed is a typed block stored in GitBook's database. The runtime is GitBook's own — there is no build step the user runs and no static site they deploy. Hosting, search indexing, CDN, redirects, and analytics are all managed by the platform.

Git Sync is an optional integration that maps a GitBook space to a branch of a GitHub or GitLab repository. Content round-trips between the editor and a directory of `.md` files written in GitBook's extended Markdown flavor (hints with `{% hint %}`, tabs, content refs, OpenAPI blocks, etc.). It is two-way: edits in the editor push commits to the repo; commits pushed to the branch update the editor. The repo is a mirror, not a source — GitBook's schema is the canonical model.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder. GitBook content is organized into a hierarchy fixed by the product — **Organizations → Collections → Spaces → Pages** — with site URLs derived from that tree. The Git Sync mirror reflects this hierarchy as nested directories.

## Content surface

Livemark accepts Markdown + MDX with React component embedding, frontmatter as a first-class concept (`path`, `order`, `icon`, `sidebar`, `date`, `tags`), and remark/rehype plugins applied at build time.

GitBook's surface is the editor's block palette: paragraphs, headings, lists, tables, hints (info/warning/danger/success), tabs, expandable blocks, code blocks with tab groups, files, images, drawings, math (KaTeX), embeds (Figma, Loom, etc.), API method blocks, OpenAPI references, and content refs (transclusion across spaces). Custom components are not user-extensible — the block set is what GitBook ships. The Git Sync flavor of Markdown encodes blocks not in CommonMark via Liquid-like tags such as `{% hint style="info" %}…{% endhint %}` and `{% tabs %}…{% endtabs %}`.

OpenAPI is a first-class input: GitBook can import an OpenAPI spec and render API reference pages from it, which is closer to Mintlify's surface than to Livemark's.

## Feature matrix

| Capability                  | Livemark                              | GitBook                                                                            |
| --------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| Versioning                  | No                                    | Yes (space variants / version groups)                                              |
| Internationalization (i18n) | No                                    | Yes (per-language variants of a space)                                             |
| Search                      | Yes (Orama, client-side)              | Yes (hosted, with GitBook AI / "Lens" Q&A on paid tiers)                           |
| Blog                        | Yes (built-in section type)           | No                                                                                 |
| Changelog                   | Yes (section type)                    | No (Change Requests are an editorial workflow, not a published section)            |
| Sitemap                     | Yes                                   | Yes (generated by the platform)                                                    |
| RSS                         | Yes (per blog section)                | No                                                                                 |
| Themes                      | Component overrides via `.livemark/`  | Customization through site settings (colors, fonts, layout); no template overrides |
| Plugins                     | Vite plugins + remark/rehype          | Proprietary integrations (Intercom, Segment, GA, etc.)                             |
| Custom routes               | `.livemark/routes/` (TanStack Router) | No (URLs follow the space → page hierarchy)                                        |
| API reference from OpenAPI  | No (manual)                           | Yes (built-in)                                                                     |
| Standalone toolchain        | Node + npm                            | None on user side; SaaS                                                            |

## Output & deployment

Livemark produces a directory of prerendered HTML + assets (`.livemark/build/client/`) that can be uploaded to any static host. See [Deployment](/deployment/) for host guides.

GitBook does not emit a deployable artifact. The site is hosted at `<space>.gitbook.io` by default, or attached to a custom domain via DNS. CDN, TLS, redirects, access control, and analytics are configured in the GitBook dashboard. Self-hosting is restricted to the Enterprise tier and is not available on the standard plans. The artifact closest to "your content" is whatever the Git Sync mirror writes into the connected repository, which is content only — not a buildable site.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
