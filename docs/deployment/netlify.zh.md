---
title: Netlify
description: 通过 Netlify 的 git 集成或 CLI 部署，支持分支预览和原子发布。
path: /deployment/netlify/
icon: globe
order: 5
---

# Netlify

Netlify 会读取项目根目录中一个小小的 `netlify.toml`，从中获取构建命令和发布目录。其余部分（Git 预览、原子部署、自定义域名）都会自动处理。

:::note
本指南发布的是预渲染的静态输出。Livemark 基于 [TanStack Start](https://tanstack.com/start) 构建，它还支持通过 Netlify 预设进行完全动态的 SSR：`.livemark/build/` 会变成一个可部署的 Netlify 函数。如需切换，参见 [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)。
:::

## 构建站点 {#build-the-site}

```bash
livemark build
```

输出位于 `.livemark/build/client/`。

## 配置 `netlify.toml` {#configure-netlifytoml}

```toml title="netlify.toml"
[build]
command = "livemark build"
publish = ".livemark/build/client"
```

这就是 Netlify 所需的全部配置。如果你想在本地模拟平台的边缘行为，同一个文件还能让你使用 `netlify dev`。

## 使用 git 集成部署 {#deploy-with-the-git-integration}

推荐的方式：在 [app.netlify.com/start](https://app.netlify.com/start) 连接你的仓库。Netlify 会读取 `netlify.toml`，运行构建，并把每次推送到 `main` 的内容发布到生产环境。其他分支和 PR 会自动获得独立的部署预览 URL。

## 使用 CLI 部署 {#deploy-with-the-cli}

适用于一次性或脚本化的部署：

```bash
livemark build
netlify deploy --prod --dir=.livemark/build/client
```

首次运行时会提示你执行 `netlify login`，并将该目录关联到一个站点。

## 使用 GitHub Actions 部署 {#deploy-with-github-actions}

Netlify 的 git 集成通常就足够了，但使用工作流可以让部署以测试通过为前提：

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
      - run: pnpm livemark build
      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: .livemark/build/client
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

在 **User settings → Applications → Personal access tokens** 中获取认证令牌，在 **Site settings → General** 中获取站点 ID。

## 自定义域名 {#custom-domain}

在站点控制台中进入 **Domain management → Add a domain**。Netlify 会配置 DNS 和证书。在 `livemark.config.ts` 中将同一域名设为 `site`。

## 另请参阅 {#see-also}

- [站点元数据](/zh/customization/site-metadata/)：`site` 用于填充 sitemap 和 RSS 订阅源的 URL。
- [部署](/zh/deployment/)：返回托管平台索引。
