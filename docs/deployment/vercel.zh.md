---
title: Vercel
description: 通过 Vercel 的 git 集成或 CLI 部署，每个 PR 都有预览 URL。
path: /deployment/vercel/
icon: triangle
order: 4
---

# Vercel

Vercel 能自动识别 Vite，但猜不出 Livemark 非标准的构建目录。只需一个两行的 `vercel.json` 即可。

:::note
本指南发布的是预渲染的静态输出。Livemark 基于 [TanStack Start](https://tanstack.com/start) 构建，它还支持通过 Vercel 预设进行完全动态的 SSR：`.livemark/build/` 会变成一个可部署的 serverless 函数。如需切换，参见 [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)。
:::

## 构建站点 {#build-the-site}

```bash
livemark build
```

输出位于 `.livemark/build/client/`。

## 配置 `vercel.json` {#configure-verceljson}

将以下内容放到项目根目录，让 Vercel 使用正确的命令并提供正确的目录：

```json title="vercel.json"
{
  "buildCommand": "livemark build",
  "outputDirectory": ".livemark/build/client"
}
```

这就是全部配置：之后的安装、构建和静态服务都由 Vercel 处理。

## 使用 git 集成部署 {#deploy-with-the-git-integration}

推荐的方式：在 [vercel.com/new](https://vercel.com/new) 导入你的仓库。Vercel 会将框架识别为 Vite（Livemark 构建于 Vite + TanStack Start 之上），读取 `vercel.json`，并运行与你在本地相同的 `livemark build`。每次推送到 `main` 都会发布到生产环境；其他每个分支和 PR 都会获得独立的预览 URL。

## 使用 CLI 部署 {#deploy-with-the-cli}

适用于一次性或脚本化的部署：

```bash
livemark build
vercel deploy --prod
```

首次运行时会提示你执行 `vercel login`，并将该目录关联到一个 Vercel 项目。

## 使用 GitHub Actions 部署 {#deploy-with-github-actions}

Vercel 的 git 集成通常单独使用就足够了，但你也可以让部署以 CI 测试通过为前提：

```yaml title=".github/workflows/deploy.yaml"
name: deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          cache: pnpm
          node-version: 24
      - run: pnpm install
      - run: pnpm test
      - run: npm install --global vercel
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

`vercel build` 会运行 `vercel.json` 中的 `buildCommand`（即 `livemark build`），并把 `.livemark/build/client/` 打包进 `.vercel/output/`，再由 `vercel deploy --prebuilt` 原样上传。你需要将 `VERCEL_TOKEN`、`VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID` 设为密钥（后两者在本地首次运行 `vercel link` 后位于 `.vercel/project.json` 中）。

## 自定义域名 {#custom-domain}

在项目控制台中进入 **Settings → Domains → Add**。Vercel 会引导你完成 DNS 记录的设置，并自动配置证书。在 `livemark.config.ts` 中将同一域名设为 `site`。

## 另请参阅 {#see-also}

- [站点元数据](/zh/customization/site-metadata/)：`site` 用于填充 sitemap 和 RSS 订阅源的 URL。
- [部署](/zh/deployment/)：返回托管平台索引。
