---
title: GitHub Pages
description: Deploy your site to GitHub Pages, including project sites under a sub-path.
path: /deployment/github-pages/
icon: github
order: 2
---

# GitHub Pages

GitHub Pages serves a directory of static files at one of two URL shapes:

- **User/org site** — `https://<user>.github.io/`, served from a repo named `<user>.github.io`. No sub-path.
- **Project site** — `https://<user>.github.io/<repo>/`, served from any other repo. The `/<repo>/` prefix matters; routes and asset URLs must include it.

## Build the site

```bash
livemark build
```

Output lands in `.livemark/build/client/`.

## Configure `base` for project sites

If you're publishing under `https://<user>.github.io/<repo>/`, set the `base` field so every route and asset URL is prefixed correctly. The function form keeps dev simple — `livemark start` still serves at `/`, only the production build mounts under `/<repo>/`:

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://acme.github.io/my-docs",
  base: command => (command === "build" ? "/my-docs" : undefined),
})
```

For user/org sites at the root, omit `base` entirely.

:::tip
Custom domains skip the `/<repo>/` sub-path even on project sites. If you're attaching a domain like `docs.example.com`, leave `base` unset and set `site` to the final domain.
:::

## Deploy manually

The simplest one-shot deploy uses the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package:

```bash
livemark build
gh-pages -d .livemark/build/client
```

This pushes the build to the `gh-pages` branch. In your repo settings, set **Pages → Source** to "Deploy from a branch" and pick `gh-pages` / `/ (root)`.

## Deploy with GitHub Actions

The official Pages actions are the cleanest path — no extra branch, no service tokens:

```yaml title=".github/workflows/deploy.yaml"
name: deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          cache: pnpm
          node-version: 24
      - run: pnpm install
      - run: livemark build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .livemark/build/client

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

Set **Pages → Source** to "GitHub Actions" in your repo settings.

## Custom domain

Add a `CNAME` file with your domain to `.livemark/public/`:

```text title=".livemark/public/CNAME"
docs.example.com
```

Anything in `.livemark/public/` is copied to the build output as-is, so the file lands at the root of your deployment. Configure the DNS at your registrar (a `CNAME` record pointing at `<user>.github.io`) and set the domain in **Pages → Custom domain**.

## See also

- [Site Metadata](/customization/site-metadata/) — `site` is required for absolute URLs in the sitemap, RSS, and Open Graph tags.
- [Deployment](/deployment/) — back to the host index.
