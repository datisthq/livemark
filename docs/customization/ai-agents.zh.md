---
title: AI 智能体
description: 向 AI 智能体提供 Markdown、llms.txt、内容信号和智能体技能。
path: /customization/ai-agents/
icon: bot
order: 11
---

# AI 智能体

每次 `livemark build` 都会以 AI 智能体所需的形式发布你的站点，与浏览器获取的 HTML 并列。这一切无需任何配置，下面的两个选项只是对其进行调整。

## 构建产物 [#what-the-build-emits]

| 文件                                   | 用途                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| `<page>/index.md`                      | 每篇文章和栏目列表的 Markdown 副本，位于其 `index.html` 旁边                    |
| `/llms.txt`                            | 一个 [llms.txt](https://llmstxt.org/) 索引，按栏目分组链接所有副本              |
| `/index.md`                            | 首页的副本；当 `/` 处没有文章时，则是 `llms.txt` 的拷贝                         |
| `/robots.txt`                          | 增加一行 `Content-Signal`，声明自动化系统可以如何使用你的内容                   |
| `/_headers`                            | 首页上的 `Link` 头，指向 `llms.txt`、`index.md` 和技能索引                      |
| `/.well-known/agent-skills/index.json` | 一个 [Agent Skills](https://agentskills.io/) 发现索引，在设置了 `skills` 时生成 |

每个文章页面还带有 `<link rel="alternate" type="text/markdown">`，指向它的副本。

你在 `.livemark/public/` 下放置的同名文件会替换生成的文件。`_headers` 是唯一的例外：你的规则会被保留，生成的 `Link` 规则追加在其后。这些文件只由 `livemark build` 写出，因此 `livemark start` 不会提供它们。

## 内容信号 [#content-signals]

`contentSignals` 控制 `robots.txt` 中的 [Content Signals](https://contentsignals.org/) 行。三个信号默认都为 `true`：

```ts title="livemark.config.ts"
export default defineConfig({
  contentSignals: {
    search: true, // build a search index and show links to your pages
    aiInput: true, // feed pages to a model answering a question in real time
    aiTrain: false, // train or fine-tune models on your content
  },
})
```

生成的这一行位于 `User-agent: *` 分组中：`Content-Signal: search=yes, ai-input=yes, ai-train=no`。

## 智能体技能 [#agent-skills]

如果你的项目附带 [Agent Skills](https://agentskills.io/specification)，将 `skills` 指向它们的 `SKILL.md` 文件：

```ts title="livemark.config.ts"
export default defineConfig({
  skills: "skills/*/SKILL.md",
})
```

每个匹配到的技能都会发布到 `/.well-known/agent-skills/<name>/SKILL.md`，并连同 `sha256` 摘要一起列在 `index.json` 中。它的 frontmatter 需要一个 `name`（小写字母、数字和单个连字符）和一个 `description`，缺少任何一个都会导致构建失败。

## 按需提供 Markdown [#markdown-on-request]

智能体通过向页面 URL 发送 `Accept: text/markdown` 来请求 Markdown。静态托管本身无法响应这种请求，但 CDN 上的重写规则可以为这些请求提供 `<page>/index.md`，而其他所有人仍然获得 HTML。每篇文章和栏目列表都有副本，因此重写永远不会指向不存在的文件。现成的规则请参阅 [Cloudflare → 面向智能体的 Markdown](/zh/deployment/cloudflare/#markdown-for-agents)。

## 另请参阅 [#see-also]

- [智能体技能](/zh/agent-skills/)：将 Livemark 自带的技能安装到你的编码智能体中。
- [配置文件](/zh/customization/config-file/)：所有顶层选项。
- [自定义路由](/zh/customization/custom-routes/)：`.livemark/public/` 下的静态文件。
