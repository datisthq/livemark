---
title: Cloudflare
description: 通过 Cloudflare Workers 和静态资源部署，这也是 livemark.dev 本身采用的方案。
path: /deployment/cloudflare/
icon: cloud
order: 3
---

# Cloudflare

Cloudflare Workers 可以直接提供静态资源目录：无需额外的计算资源，也无需 SPA 垫片。`livemark.dev` 就是这样发布的，同样结构的 `wrangler.jsonc` 适用于任何 Livemark 站点。

:::note
本指南发布的是预渲染的静态输出。Livemark 基于 [TanStack Start](https://tanstack.com/start) 构建，它还支持通过 Nitro 预设在 Cloudflare Workers 上进行完全动态的 SSR：`.livemark/build/` 会变成一个可部署的 Worker 包。如需切换，参见 [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)。
:::

## 构建站点 [#build-the-site]

```bash
livemark build
```

输出位于 `.livemark/build/client/`。

## 配置 `wrangler.jsonc` [#configure-wranglerjsonc]

将以下内容放到项目根目录：

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

关键在于两个字段：

| 字段               | 作用                                                           |
| ------------------ | -------------------------------------------------------------- |
| `assets.directory` | 让 Wrangler 指向 Livemark 的构建输出。每个文件都按原样提供。   |
| `workers_dev`      | 测试期间为你提供一个 `<name>.<account>.workers.dev` 预览 URL。 |

## 从本机部署 [#deploy-from-your-machine]

```bash
livemark build
wrangler deploy
```

首次运行时会提示你执行 `wrangler login`，以授权访问你的 Cloudflare 账户。

## 使用 GitHub Actions 部署 [#deploy-with-github-actions]

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
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

在 **My Profile → API Tokens** 中创建一个限定权限的 API 令牌（“Edit Cloudflare Workers” 模板恰好授予所需权限），并将这两个值保存为仓库密钥。

## 自定义域名 [#custom-domain]

当你的域名区域（zone）托管在 Cloudflare 上后，添加一个 `routes` 块：

```jsonc title="wrangler.jsonc"
{
  "name": "my-docs",
  "compatibility_date": "2026-04-01",
  "assets": { "directory": ".livemark/build/client" },
  "routes": [{ "pattern": "docs.example.com", "custom_domain": true }],
}
```

`custom_domain: true` 会让 Cloudflare 配置一个托管域名：DNS、证书和路由都会自动处理。在 `livemark.config.ts` 中将 `site` 设置为同一域名，使 sitemap 和 RSS 订阅源中的绝对 URL 保持一致。

:::tip
Livemark 仓库自己的 `wrangler.jsonc` 就是一份可用的参考，参见[项目根目录](https://github.com/datisthq/livemark/blob/main/wrangler.jsonc)。
:::

## 面向智能体的 Markdown [#markdown-for-agents]

AI 智能体通过发送 `Accept: text/markdown` 来请求页面的 Markdown 版本。静态资源总是返回 HTML，因此需要在你的域名区域中添加一条 URL Rewrite Rule，把这类请求指向页面的 [Markdown 副本](/zh/customization/ai-agents/)。URL Rewrite Rules 在所有套餐（包括免费套餐）中均可用，站点也依然保持完全静态。

在控制台中打开你的域名，进入 **Rules → Overview → Create rule → URL Rewrite Rule**，然后填写：

| 字段                       | 值                                                                     |
| -------------------------- | ---------------------------------------------------------------------- |
| Rule name                  | `Markdown for agents`                                                  |
| If incoming requests match | Custom filter expression（见下）                                       |
| Path                       | Rewrite to → **Dynamic** → `concat(http.request.uri.path, "index.md")` |
| Query                      | Preserve                                                               |

```txt title="Filter expression"
any(http.request.headers["accept"][*] contains "text/markdown") and ends_with(http.request.uri.path, "/")
```

页面 URL 以 `/` 结尾，因此该规则只作用于页面。对 `/guide` 的请求会先被重定向到 `/guide/`，然后再被重写。静态资源会以 `text/markdown` 类型提供 `.md` 文件，因此响应类型无需额外规则。

:::warning
在启用该规则之前，先部署一个包含 Markdown 副本的构建。否则，请求 Markdown 的智能体会得到 404。
:::

## 另请参阅 [#see-also]

- [AI 智能体](/zh/customization/ai-agents/)：构建为智能体发布了哪些内容。

- [站点元数据](/zh/customization/site-metadata/)：`site` 支撑绝对 URL 和订阅源的生成。
- [部署](/zh/deployment/)：返回托管平台索引。
