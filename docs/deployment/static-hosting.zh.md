---
title: 静态托管
description: "从任意静态托管平台提供构建目录：nginx、S3 + CloudFront、Caddy 等。"
path: /deployment/static-hosting/
icon: server
order: 1
---

# 静态托管

Livemark 的构建产物就是一个由 `.html`、`.css`、`.js` 和资源文件组成的普通目录。任何能提供文件目录服务的程序都可以使用。本指南介绍几种常见的配置方式。

## 构建站点 [#build-the-site]

```bash
livemark build
```

输出位于 `.livemark/build/client/`。请将该目录作为文档根目录。

## 预渲染与 SPA 回退 [#prerendering-vs-spa-fallback]

Livemark 会在 `livemark build` 期间把每个路由预渲染到磁盘上。像 `/customization/site-metadata/` 这样的深层链接会落到 `customization/site-metadata/index.html` 这个真实文件上，已知页面无需客户端路由回退。

不过，SPA 回退（把未知路径重写到 `index.html`）仍然值得配置，作为纵深防御：它能让 404 在客户端优雅地渲染，而不是显示托管平台默认的错误页。

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

每次发布时，将 `.livemark/build/client/*` 复制到 `/var/www/docs/`。

## Caddy

```caddy title="Caddyfile"
docs.example.com {
  root * /var/www/docs
  try_files {path} {path}/index.html /index.html
  file_server
  encode gzip zstd
}
```

当域名解析到 Caddy 时，它会自动配置 Let's Encrypt 证书。

## AWS S3 + CloudFront

标准做法是以 S3 存储桶作为源站，前面放置 CloudFront：

1. 将 `.livemark/build/client/` 上传到 S3 存储桶（`aws s3 sync .livemark/build/client/ s3://my-docs --delete`）。
2. 将 **Static website hosting → Index document** 设为 `index.html`。
3. 创建一个指向该存储桶的 CloudFront 分发。
4. 在 CloudFront 中添加一条 **Custom error response**，将 `404` 映射到 `/index.html`，响应码为 `200`。这就是未知路径的 SPA 回退。
5. 将分发的默认根对象设为 `index.html`。

要对带哈希的资源进行长期缓存控制，请添加一条缓存策略，使其遵循 `/assets/*` 对象上设置的 `Cache-Control` 头。

## Apache

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

将构建产物放到文档根目录。两条 `RewriteCond` 确保真实存在的文件和目录直接提供，只有未匹配的路径才会回退。

## 其他托管平台 [#other-hosts]

同样的方法也适用于 Render Static、Surge、Fly Static、Bunny，或任何搭配 CDN 的对象存储：上传目录，将域名指向它，并确保未知路径回退到 `index.html`。

## 使用 GitHub Actions 部署 [#deploy-with-github-actions]

一个基于 nginx/SSH 的最简示例：

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
      - uses: easingthemes/ssh-deploy@v5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SSH_HOST }}
          REMOTE_USER: ${{ secrets.SSH_USER }}
          SOURCE: .livemark/build/client/
          TARGET: /var/www/docs/
          ARGS: -avzr --delete
```

对于 S3，将部署步骤换成 `aws-actions/configure-aws-credentials` + `aws s3 sync`。

## 另请参阅 [#see-also]

- [站点元数据](/zh/customization/site-metadata/)：`site` 支撑绝对 URL 和订阅源的生成。
- [部署](/zh/deployment/)：返回托管平台索引。
