---
name: livemark-deployment
description: Use when publishing a Livemark site — building into .livemark/build/client/, setting site and base, and wiring Cloudflare, GitHub Pages, Vercel, Netlify or any static host, by hand or from CI.
---

# Livemark Deployment

Guidance for shipping a Livemark project's production build to a host.

## When to use this skill

Invoke when the user asks to:

- Deploy, publish or host the site, or set up a deploy workflow in CI.
- Add a host config file (`wrangler.jsonc`, `vercel.json`, `netlify.toml`, nginx, Caddy, S3).
- Serve the site under a sub-path such as a GitHub Pages project site.
- Attach a custom domain, or fix broken links, assets or feeds after a deploy.

## The build

```bash
npx livemark build     # prerender every route into .livemark/build/client/
npx livemark preview   # serve that build locally on port 8000
```

`.livemark/build/client/` is the **only** directory to publish: an `index.html` per route plus assets, `sitemap.xml`, `robots.txt`, RSS feeds, Markdown twins, `llms.txt` and a `_headers` file. Not `dist/`, and not `.livemark/build/` itself — its `server/` sibling is the prerender bundle, not a site. Gitignore `.livemark/build/`; it is regenerated on every build.

## Config that affects deployment

```ts
// livemark.config.ts
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://acme.github.io/my-docs", // final public origin, with any sub-path
  base: command => (command === "build" ? "/my-docs" : undefined),
})
```

- **`site`** — without it there is no `sitemap.xml` and no RSS feed, and `robots.txt` and `llms.txt` lose their absolute URLs. Set it to the final domain, including after attaching a custom domain.
- **`base`** — only for a site mounted under a sub-path. Use the function form so `livemark start` still serves at `/`. A custom domain removes the sub-path: drop `base` again.

## Hosts

| Host          | What to add                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------- |
| Cloudflare    | `wrangler.jsonc` with `assets.directory: ".livemark/build/client"`, then `wrangler deploy`   |
| GitHub Pages  | `actions/upload-pages-artifact` with `path: .livemark/build/client`, then `deploy-pages`     |
| Vercel        | `vercel.json`: `buildCommand: "livemark build"`, `outputDirectory: ".livemark/build/client"` |
| Netlify       | `netlify.toml`: `command = "livemark build"`, `publish = ".livemark/build/client"`           |
| Static server | Copy `.livemark/build/client/*` to the docroot; try `$uri`, `$uri/index.html`, `/index.html` |

A CI workflow installs dependencies, runs the build through the package manager (`pnpm livemark build`: a bare `livemark` is not on a CI step's `PATH`), then hands `.livemark/build/client` to the host's action or CLI. Name it `.github/workflows/deploy.yaml`.

## Rules of thumb

1. **Static files go in `.livemark/public/`**, not the build output — a `CNAME` for GitHub Pages, extra `_headers` rules. Anything written into `.livemark/build/client/` by hand is lost on the next build.
2. **`_headers` is generated.** Cloudflare and Netlify read it. To add rules, ship `.livemark/public/_headers`; Livemark keeps it and appends its own `Link` rule.
3. **Prerendered routes end in `/`.** `/guide/` is the file `guide/index.html`; a host that does not resolve directory indexes serves 404s for every page.
4. **Agents asking for Markdown** (`Accept: text/markdown`) need a host rewrite from `<path>/` to `<path>/index.md`. On Cloudflare that's a zone URL Rewrite Rule; deploy a build with the twins before enabling it.

## Verification

- `npx livemark build`, then `npx livemark preview` — click through a deep link and an asset.
- With `base` set, grep `.livemark/build/client/index.html` for `/<base>/assets/` to confirm asset URLs carry the prefix.
- With `site` set, check `.livemark/build/client/sitemap.xml` exists and uses the right origin.

## References

- Narrative docs, one page per host: https://livemark.dev/deployment/.
- `site` and `base`: `source/models/config.ts`.
- Generated agent files and `_headers`: `source/plugins/vite-agents.ts`.
