---
title: Vercel
description: Deploy via Vercel's git integration or the CLI, with preview URLs per PR.
path: /deployment/vercel/
icon: triangle
order: 4
---

# Vercel

Vercel auto-detects Vite but won't guess Livemark's non-standard build directory. A two-line `vercel.json` is all it takes.

:::note
This guide ships the prerendered static output. Livemark is built on [TanStack Start](https://tanstack.com/start), which also supports fully dynamic SSR via the Vercel preset — `.livemark/build/` becomes a deployable serverless function. See [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for the switch.
:::

## Build the site

```bash
livemark build
```

Output lands in `.livemark/build/client/`.

## Configure `vercel.json`

Drop this at your project root so Vercel uses the right command and serves the right directory:

```json title="vercel.json"
{
  "buildCommand": "livemark build",
  "outputDirectory": ".livemark/build/client"
}
```

That's the whole config — Vercel handles install, build, and static serving from there.

## Deploy with the git integration

The recommended path: import your repo at [vercel.com/new](https://vercel.com/new). Vercel detects the framework as Vite (Livemark builds on top of Vite + TanStack Start), reads `vercel.json`, and runs the same `livemark build` you'd run locally. Every push to `main` ships to production; every other branch and PR gets a unique preview URL.

## Deploy with the CLI

For one-shot or scripted deploys:

```bash
livemark build
vercel deploy --prod
```

The first run prompts for `vercel login` and links the directory to a Vercel project.

## Deploy with GitHub Actions

Vercel's git integration is usually enough on its own, but you can gate deploys on CI tests:

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
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

You'll need `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as secrets (the latter two live in `.vercel/project.json` after the first local `vercel link`).

## Custom domain

In the project dashboard, **Settings → Domains → Add**. Vercel walks through DNS records and provisions a certificate automatically. Set the same domain as `site` in `livemark.config.ts`.

## See also

- [Site Metadata](/customization/site-metadata/) — `site` populates the sitemap and RSS feed URLs.
- [Deployment](/deployment/) — back to the host index.
