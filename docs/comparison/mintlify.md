---
title: Mintlify vs Livemark
label: Mintlify
description: Self-hosted open-source docs vs hosted commercial docs SaaS.
path: /comparison/mintlify/
icon: sparkles
order: 3
---

# Mintlify vs Livemark

[Mintlify](https://mintlify.com) is a commercial docs platform. Content is authored in MDX in a Git repository; Mintlify hosts the rendered site, search, and analytics. Pricing is per-editor, with a free tier for open-source projects.

## At a glance

| Axis               | Livemark                         | Mintlify                                                       |
| ------------------ | -------------------------------- | -------------------------------------------------------------- |
| Language / runtime | TypeScript / Node 24+            | Author in MDX; runtime is Mintlify's hosted stack (not public) |
| UI framework       | React 19                         | React (per Mintlify's docs)                                    |
| Build tool         | Vite + TanStack Start            | Mintlify CLI (preview) + hosted build                          |
| Content format     | Markdown + MDX                   | Markdown + MDX                                                 |
| License            | MIT, self-hosted                 | Proprietary, hosted-only                                       |
| Output model       | Prerendered static (SSR-capable) | Hosted on Mintlify infrastructure                              |

## Architecture

Livemark is a Node CLI that builds a static site you host anywhere. The source and the output are both yours.

Mintlify is a hosted SaaS. You commit MDX + a `mint.json` config to a Git repo; Mintlify pulls it on push, builds, and serves the result from `<your-subdomain>.mintlify.app` or a custom domain. The build pipeline and runtime are managed and not user-installable.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. Mintlify expects the file tree to match the `navigation` block in `mint.json`; routes mirror file paths under the configured content root.

## Content surface

Both tools accept Markdown + MDX with frontmatter and component embedding.

Mintlify ships a fixed set of components (`<Card>`, `<Accordion>`, `<Tabs>`, `<Steps>`, …) that authors compose in MDX. You don't write your own React components for the docs UI — you use Mintlify's primitives.

Livemark's directives (`:::card`, `:::tab`, `:::steps`) produce the same kind of UI through Livemark's component layer, which you can override via `.livemark/components/`.

Mintlify's `mint.json` configures navigation, branding, and integrations in one declarative file. Livemark uses `livemark.config.ts` for the same role plus `.livemark/` overlays for per-file customization.

## Feature matrix

| Capability                  | Livemark                             | Mintlify                   |
| --------------------------- | ------------------------------------ | -------------------------- |
| Versioning                  | No                                   | Yes (built-in)             |
| Internationalization (i18n) | No                                   | Yes (built-in)             |
| Search                      | Yes (Orama, client-side)             | Yes (built-in, AI-powered) |
| AI chat / agents            | No                                   | Yes (built-in)             |
| Analytics                   | No (bring your own)                  | Yes (built-in dashboard)   |
| OpenAPI rendering           | No                                   | Yes (built-in)             |
| Blog                        | Yes (built-in section type)          | Yes (changelog/news pages) |
| Sitemap                     | Yes                                  | Yes                        |
| RSS                         | Yes (per blog section)               | Yes (changelog feeds)      |
| Themes                      | Component overrides via `.livemark/` | Theming via `mint.json`    |
| Custom routes               | `.livemark/routes/`                  | No (content-only)          |
| Self-host                   | Yes                                  | No                         |

## Output & deployment

Livemark builds a static directory you deploy to any host — see [Deployment](/deployment/).

Mintlify deploys are handled by Mintlify. You don't build or host the output yourself; the platform serves the rendered site from its CDN and provisions TLS, domains, and previews. Disconnecting from Mintlify means re-authoring or migrating the content elsewhere.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
