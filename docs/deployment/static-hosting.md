---
title: Static Hosting
description: Serve the build directory from any static host — nginx, S3 + CloudFront, Caddy, and friends.
path: /deployment/static-hosting/
icon: server
order: 1
---

# Static Hosting

Livemark's build is a plain directory of `.html`, `.css`, `.js`, and asset files. Anything that can serve a directory of files will work. This guide covers the common shapes.

## Build the site

```bash
livemark build
```

Output lands in `.livemark/build/client/`. Treat that directory as your document root.

## Prerendering vs SPA fallback

Livemark prerenders every route to disk during `docs:build`. A deep link like `/customization/site-metadata/` lands on a real file at `customization/site-metadata/index.html` — no client-side routing fallback needed for known pages.

The SPA fallback (rewriting unknown paths to `index.html`) is still worth configuring as defence-in-depth — it gives 404s a graceful client-side render instead of the host's default error page.

## nginx

```nginx title="/etc/nginx/conf.d/docs.conf"
server {
  listen 80;
  server_name docs.example.com;
  root /var/www/docs;

  # Try the exact file, then a directory's index.html, then SPA fallback.
  location / {
    try_files $uri $uri/index.html /index.html =404;
  }

  # Long-cache hashed assets.
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

Copy `.livemark/build/client/*` to `/var/www/docs/` on each release.

## Caddy

```caddy title="Caddyfile"
docs.example.com {
  root * /var/www/docs
  try_files {path} {path}/index.html /index.html
  file_server
  encode gzip zstd
}
```

Caddy auto-provisions Let's Encrypt certificates when the domain resolves to it.

## AWS S3 + CloudFront

The standard pattern is an S3 bucket as origin and CloudFront in front:

1. Upload `.livemark/build/client/` to an S3 bucket (`aws s3 sync .livemark/build/client/ s3://my-docs --delete`).
2. Set **Static website hosting → Index document** to `index.html`.
3. Create a CloudFront distribution pointing at the bucket.
4. In CloudFront, add a **Custom error response** mapping `404` to `/index.html` with response code `200`. This is the SPA fallback for unknown paths.
5. Set the distribution's default root object to `index.html`.

For long-cache control on hashed assets, add a cache policy that respects the `Cache-Control` headers set on `/assets/*` objects.

## Apache

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

Place the build at the docroot. The two `RewriteCond`s ensure real files and directories are served directly, only unmatched paths fall back.

## Other hosts

The same recipe works on Render Static, Surge, Fly Static, Bunny, or any object store with a CDN: upload the directory, point a domain at it, and ensure unknown paths fall back to `index.html`.

## Deploy with GitHub Actions

A minimal nginx/SSH example:

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
      - run: livemark build
      - uses: easingthemes/ssh-deploy@v5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SSH_HOST }}
          REMOTE_USER: ${{ secrets.SSH_USER }}
          SOURCE: .livemark/build/client/
          TARGET: /var/www/docs/
          ARGS: -avzr --delete
```

For S3, swap the deploy step for `aws-actions/configure-aws-credentials` + `aws s3 sync`.

## See also

- [Site Metadata](/customization/site-metadata/) — `site` powers absolute URLs and feed generation.
- [Deployment](/deployment/) — back to the host index.
