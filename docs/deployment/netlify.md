---
title: Netlify
description: Deploy via Netlify's git integration or the CLI, with branch previews and atomic releases.
path: /deployment/netlify/
icon: globe
order: 5
---

# Netlify

Netlify reads a small `netlify.toml` at your project root to pick up the build command and publish directory. The rest — Git previews, atomic deploys, custom domains — is handled automatically.

:::note
This guide ships the prerendered static output. Livemark is built on [TanStack Start](https://tanstack.com/start), which also supports fully dynamic SSR via the Netlify preset — `.livemark/build/` becomes a deployable Netlify function. See [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for the switch.
:::

## Build the site

```bash
livemark build
```

Output lands in `.livemark/build/client/`.

## Configure `netlify.toml`

```toml title="netlify.toml"
[build]
command = "livemark build"
publish = ".livemark/build/client"
```

That's all Netlify needs. The same file unlocks `netlify dev` locally if you ever want to mirror the platform's edge behavior.

## Deploy with the git integration

The recommended path: connect your repo at [app.netlify.com/start](https://app.netlify.com/start). Netlify reads `netlify.toml`, runs the build, and ships every push to `main` to production. Other branches and PRs get unique deploy preview URLs automatically.

## Deploy with the CLI

For one-shot or scripted deploys:

```bash
livemark build
netlify deploy --prod --dir=.livemark/build/client
```

The first run prompts for `netlify login` and links the directory to a site.

## Deploy with GitHub Actions

Netlify's git integration is usually enough, but a workflow gives you test-before-deploy gating:

```yaml title=".github/workflows/deploy.yaml"
name: deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          cache: pnpm
          node-version: 24
      - run: pnpm install
      - run: pnpm test
      - run: livemark build
      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: .livemark/build/client
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

Get the auth token from **User settings → Applications → Personal access tokens**, and the site ID from **Site settings → General**.

## Custom domain

In the site dashboard, **Domain management → Add a domain**. Netlify provisions DNS and a certificate. Set the same domain as `site` in `livemark.config.ts`.

## See also

- [Site Metadata](/customization/site-metadata/) — `site` populates the sitemap and RSS feed URLs.
- [Deployment](/deployment/) — back to the host index.
