---
title: 版本管理
description: 通过栏目或独立部署，并列发布多个版本的文档。
path: /customization/versioning/
icon: git-branch
order: 9
---

# 版本管理

Livemark 没有专门的版本管理功能：它已有的构建模块足以覆盖两种常见形式。根据各版本之间的差异程度来选择：

- **一个站点，每个版本一个栏目**：少数几个版本，其文档都在同一个分支上。
- **每个版本一次部署**：长期维护、各自位于独立分支上的主版本。

大多数项目只需要保留最新文档和上一个主版本的文档。如果旧版本只需要保留版本说明，一个[更新日志栏目](/zh/customization/article-sections/#changelog-sections)就足够了。

## 每个版本一个栏目 {#a-section-per-version}

将每个旧版本的文章放在各自的文件夹中，并为它们设置位于版本前缀下的 `path`。当前文档保留在 `/`，每个旧版本成为一个栏目：

```text
docs/
  getting-started.md   # path: /getting-started/
v1/
  getting-started.md   # path: /v1/getting-started/
```

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "Acme",
  include: ["docs/**/*.md", "v1/**/*.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    {
      title: "v1",
      prefix: "/v1/",
      icon: "archive",
      siteTitle: "Acme v1",
    },
  ],
})
```

最长前缀匹配会把每篇 `/v1/…` 文章路由到 `v1` 栏目，使其拥有独立的侧边栏树，而站点其余部分仍保留当前文档。`siteTitle` 会在该栏目内替换 logo 旁的品牌名称，让读者始终清楚自己在看哪个版本。设置 `position: "sidebar"` 可以让版本标签页不出现在顶栏中。

要提醒旧页面的读者，可以在每个页面开头放一个提示框：

```markdown
:::warning
You are reading the docs for v1. [See the latest version](/getting-started/).
:::
```

需要注意：

- 搜索会索引整个站点，因此结果中会包含所有版本的文章。
- 每个版本复制一个文件夹会造成内容重复；请冻结旧文件夹，只在必要时修改。

## 每个版本一次部署 {#one-deploy-per-version}

当每个主版本都位于独立分支（`main`、`v1`、…）时，将每个分支构建为独立的站点，并从各自的地址提供：子域名（`v1.docs.example.com`），或借助 [`base`](/zh/deployment/github-pages/#configure-base-for-project-sites) 使用子路径（`docs.example.com/v1/`）。

```typescript title="livemark.config.ts (v1 branch)"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://docs.example.com/v1",
  base: command => (command === "build" ? "/v1" : undefined),
  title: "Acme v1",
  banner: "You are reading the v1 docs · [Go to the latest →](https://docs.example.com/)",
  include: "docs/**/*.md",
})
```

通过 `custom` 栏目或顶栏[链接](/zh/customization/external-links/)将各个部署互相关联，起到版本切换器的作用：

```typescript title="livemark.config.ts (main branch)"
sections: [
  { title: "Docs", prefix: "/" },
  { title: "v1", type: "custom", url: "https://docs.example.com/v1/", icon: "archive" },
]
```

每个部署都有独立的搜索索引、sitemap 和 `llms.txt`，因此不同版本永远不会混在一起。代价是每个维护中的分支都需要一次构建和一个 CI 任务。各托管平台的配置请参阅[部署](/zh/deployment/)；大多数托管平台开箱即可将分支部署到各自的 URL。

## 另请参阅 {#see-also}

- [文章栏目](/zh/customization/article-sections/)：栏目类型、前缀与匹配。
- [站点元数据](/zh/customization/site-metadata/)：上文用到的 `banner`、`title` 和 `site` 字段。
