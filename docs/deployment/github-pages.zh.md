---
title: GitHub Pages
description: 将站点部署到 GitHub Pages，包括子路径下的项目站点。
path: /deployment/github-pages/
icon: github
order: 2
---

# GitHub Pages

GitHub Pages 以两种 URL 形式之一提供静态文件目录：

- **用户或组织站点**：`https://<user>.github.io/`，从名为 `<user>.github.io` 的仓库提供。没有子路径。
- **项目站点**：`https://<user>.github.io/<repo>/`，从其他任意仓库提供。`/<repo>/` 前缀很重要：路由和资源 URL 都必须包含它。

## 构建站点 {#build-the-site}

```bash
livemark build
```

输出位于 `.livemark/build/client/`。

## 为项目站点配置 `base` {#configure-base-for-project-sites}

如果你发布在 `https://<user>.github.io/<repo>/` 下，请设置 `base` 字段，让每个路由和资源 URL 都带上正确的前缀。函数形式能让开发保持简单：`livemark start` 仍然在 `/` 下提供服务，只有生产构建才挂载到 `/<repo>/` 下：

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://acme.github.io/my-docs",
  base: command => (command === "build" ? "/my-docs" : undefined),
})
```

对于位于根路径的用户或组织站点，完全省略 `base` 即可。

:::tip
即使是项目站点，自定义域名也会跳过 `/<repo>/` 子路径。如果你绑定了 `docs.example.com` 这样的域名，请不要设置 `base`，并将 `site` 设置为最终域名。
:::

## 手动部署 {#deploy-manually}

最简单的一次性部署方式是使用 [`gh-pages`](https://www.npmjs.com/package/gh-pages) 包：

```bash
livemark build
gh-pages -d .livemark/build/client
```

这会把构建产物推送到 `gh-pages` 分支。在仓库设置中，将 **Pages → Source** 设为 “Deploy from a branch”，并选择 `gh-pages` / `/ (root)`。

## 使用 GitHub Actions 部署 {#deploy-with-github-actions}

官方的 Pages actions 是最简洁的方案：无需额外分支，也无需服务令牌：

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
      - run: pnpm livemark build
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

在仓库设置中将 **Pages → Source** 设为 “GitHub Actions”。

## 自定义域名 {#custom-domain}

在 `.livemark/public/` 中添加一个写有你域名的 `CNAME` 文件：

```text title=".livemark/public/CNAME"
docs.example.com
```

`.livemark/public/` 中的所有内容都会按原样复制到构建输出，因此该文件会位于部署的根目录。在域名注册商处配置 DNS（一条指向 `<user>.github.io` 的 `CNAME` 记录），并在 **Pages → Custom domain** 中设置该域名。

## 另请参阅 {#see-also}

- [站点元数据](/zh/customization/site-metadata/)：sitemap、RSS 和 Open Graph 标签中的绝对 URL 都需要 `site`。
- [部署](/zh/deployment/)：返回托管平台索引。
