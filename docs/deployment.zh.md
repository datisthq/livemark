---
title: 部署
description: 如何将构建好的 Livemark 站点发布到托管平台。
path: /deployment/
icon: cloud-upload
order: 5
---

# 部署

`livemark build` 会在 `.livemark/build/client/` 中生成一个完全静态的站点：每个路由对应的 `index.html` 文件，外加 `sitemap.xml`、`robots.txt`、RSS 订阅源（如已配置）、[Markdown 副本与 `llms.txt`](/zh/customization/ai-agents/)，以及你的静态资源。把这个目录放到任意静态托管平台上，站点即可上线。

这些指南介绍了最常见的部署目标。任选其一即可：每篇指南都自成一体，既展示手动命令，也展示 CI 工作流。

## 托管平台 [#hosts]

:::card{title="静态托管" href="/zh/deployment/static-hosting/" icon="server"}
任何能提供文件目录服务的平台：nginx、S3 + CloudFront、Caddy 等。
:::

:::card{title="GitHub Pages" href="/zh/deployment/github-pages/" icon="github"}
免费、与 git 原生集成，非常适合部署在 `/repo-name/` 路径下的项目站点。
:::

:::card{title="Cloudflare" href="/zh/deployment/cloudflare/" icon="cloud"}
Workers + 静态资源。`livemark.dev` 本身就采用这种方案。
:::

:::card{title="Vercel" href="/zh/deployment/vercel/" icon="triangle"}
与 git 连接，每个拉取请求（PR）都有预览，域名无需配置。
:::

:::card{title="Netlify" href="/zh/deployment/netlify/" icon="globe"}
与 git 连接，支持分支部署、原子发布和内置的表单处理。
:::

## 每篇指南的前提 [#what-every-guide-assumes]

- 你运行 `livemark build`，输出位于 `.livemark/build/client/`。
- 如果希望 sitemap、robots.txt 和 RSS 生成绝对 URL，你已在 `livemark.config.ts` 中设置了 `site`，参见[站点元数据](/zh/customization/site-metadata/)。
- 只有当站点挂载在子路径下时（例如 GitHub Pages 项目站点）才需要 `base`。只有 [GitHub Pages](/zh/deployment/github-pages/) 指南涉及这一点。
