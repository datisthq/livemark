---
title: Deployment
description: How to publish your built Livemark site to a host.
path: /deployment/
icon: cloud-upload
order: 4
---

# Deployment

`livemark build` produces a fully static site in `.livemark/build/client/` — `index.html` files for every route, plus `sitemap.xml`, `robots.txt`, RSS feeds (when configured), and your assets. Drop that directory on any static host and you're live.

These guides walk through the most common targets. Pick one — every guide is self-contained and shows both the manual command and a CI workflow.

## Hosts

:::card{title="Static Hosting" href="/deployment/static-hosting/" icon="server"}
Any host that serves a directory of files — nginx, S3 + CloudFront, Caddy, and friends.
:::

:::card{title="GitHub Pages" href="/deployment/github-pages/" icon="github"}
Free, git-native, and works well for project sites under a `/repo-name/` path.
:::

:::card{title="Cloudflare" href="/deployment/cloudflare/" icon="cloud"}
Workers + static assets. The setup `livemark.dev` itself uses.
:::

:::card{title="Vercel" href="/deployment/vercel/" icon="triangle"}
Git-connected with previews per pull request and zero-config domains.
:::

:::card{title="Netlify" href="/deployment/netlify/" icon="globe"}
Git-connected with branch deploys, atomic releases, and built-in form handling.
:::

## What every guide assumes

- You run `livemark build` and the output lands in `.livemark/build/client/`.
- You've set `site` in `livemark.config.ts` if you want sitemap, robots.txt, and RSS to generate with absolute URLs — see [Site Metadata](/customization/site-metadata/).
- You only need `base` if your site is mounted at a sub-path (e.g. GitHub Pages project sites). The [GitHub Pages](/deployment/github-pages/) guide is the only one that covers it.
