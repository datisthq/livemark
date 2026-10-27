---
title: Cloudflare
description: Deploy via Cloudflare Workers with static assets — the setup livemark.dev itself uses.
path: /deployment/cloudflare/
icon: cloud
order: 3
---

# Cloudflare

Cloudflare Workers can serve a directory of static assets directly — no separate compute, no SPA shim. This is how `livemark.dev` ships, and the same `wrangler.jsonc` shape works for any Livemark site.

:::note
This guide ships the prerendered static output. Livemark is built on [TanStack Start](https://tanstack.com/start), which also supports fully dynamic SSR to Cloudflare Workers via a Nitro preset — `.livemark/build/` becomes a deployable Worker bundle. See [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for the switch.
:::

## Build the site

```bash
livemark build
```

Output lands in `.livemark/build/client/`.

## Configure `wrangler.jsonc`

Drop this at your project root:

```jsonc title="wrangler.jsonc"
{
  "name": "my-docs",
  "compatibility_date": "2026-04-01",
  "workers_dev": true,
  "assets": {
    "directory": ".livemark/build/client",
  },
}
```

Two fields do the heavy lifting:

| Field              | Purpose                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| `assets.directory` | Points Wrangler at the Livemark build output. Every file is served as-is. |
| `workers_dev`      | Gives you a `<name>.<account>.workers.dev` preview URL while testing.     |

## Deploy from your machine

```bash
livemark build
wrangler deploy
```

The first run prompts for `wrangler login` to authorize against your Cloudflare account.

## Deploy with GitHub Actions

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
      - run: pnpm livemark build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Create a scoped API token at **My Profile → API Tokens** (the "Edit Cloudflare Workers" template grants exactly what you need) and store both values as repo secrets.

## Custom domain

Add a `routes` block once your zone is on Cloudflare:

```jsonc title="wrangler.jsonc"
{
  "name": "my-docs",
  "compatibility_date": "2026-04-01",
  "assets": { "directory": ".livemark/build/client" },
  "routes": [{ "pattern": "docs.example.com", "custom_domain": true }],
}
```

`custom_domain: true` tells Cloudflare to provision a managed domain — DNS, certificate, and route are all handled for you. Set `site` to the same domain in `livemark.config.ts` so absolute URLs in the sitemap and RSS feeds line up.

:::tip
The Livemark repo's own `wrangler.jsonc` is a working reference — see the [project root](https://github.com/datisthq/livemark/blob/main/wrangler.jsonc).
:::

## Markdown for agents

AI agents ask for a page as Markdown by sending `Accept: text/markdown`. Static assets always answer with HTML, so add a URL Rewrite Rule to your zone that points those requests at the page's [Markdown twin](/customization/ai-agents/). URL Rewrite Rules are available on every plan, including Free, and the site stays fully static.

In the dashboard, open your domain, go to **Rules → Overview → Create rule → URL Rewrite Rule**, and fill in:

| Field                      | Value                                                                  |
| -------------------------- | ---------------------------------------------------------------------- |
| Rule name                  | `Markdown for agents`                                                  |
| If incoming requests match | Custom filter expression (below)                                       |
| Path                       | Rewrite to → **Dynamic** → `concat(http.request.uri.path, "index.md")` |
| Query                      | Preserve                                                               |

```txt title="Filter expression"
any(http.request.headers["accept"][*] contains "text/markdown") and ends_with(http.request.uri.path, "/")
```

Page URLs end in `/`, so the rule only touches pages. A request for `/guide` is redirected to `/guide/` first and then rewritten. Static assets serve `.md` files as `text/markdown`, so the response type needs no extra rule.

:::warning
Deploy a build that contains the twins before enabling the rule. Otherwise an agent asking for Markdown gets a 404.
:::

## See also

- [AI Agents](/customization/ai-agents/) — what the build publishes for agents.

- [Site Metadata](/customization/site-metadata/) — `site` powers absolute URLs and feed generation.
- [Deployment](/deployment/) — back to the host index.
