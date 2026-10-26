---
title: 智能体技能
description: 让你的编程智能体学会编写、配置和定制 Livemark 站点。
path: /agent-skills/
icon: sparkles
order: 2
---

# 智能体技能

Livemark 自带 [Agent Skills](https://agentskills.io/)，向 Claude Code、Cursor 和 Codex 等编程智能体说明 Livemark 项目的工作方式。安装之后，你的智能体就会知道文章放在哪里、有哪些配置项、如何覆盖界面、如何设计首页以及如何部署站点。这些都无需你在提示词中解释。

| 技能                     | 你的智能体在以下场景使用它                                   |
| ------------------------ | ------------------------------------------------------------ |
| `livemark-authoring`     | 添加或编辑 Markdown 文章、frontmatter、图片和补丁            |
| `livemark-configuration` | 编辑 `livemark.config.ts`：元数据、glob、栏目、导航          |
| `livemark-customization` | 设置主题、覆盖（escape）组件或添加自定义路由                 |
| `livemark-landing`       | 以 livemark.dev 的首页为参考设计首页                         |
| `livemark-deployment`    | 将构建产物发布到 Cloudflare、GitHub Pages、Vercel 或 Netlify |

## 从网站安装 [#install-from-the-website]

livemark.dev 在 `/.well-known/agent-skills/` 下发布其技能，因此 [`skills` CLI](https://github.com/vercel-labs/skills) 可以直接通过站点 URL 安装它们。在项目根目录运行：

```bash
npx skills add https://livemark.dev
```

它会询问要安装哪些技能、为哪些智能体安装。如果想跳过这些提问，可以通过参数传入：

```bash
npx skills add https://livemark.dev --skill livemark-authoring --agent claude-code
```

添加 `--global` 可为当前用户而非项目安装，添加 `--list` 可在不安装任何内容的情况下查看可用技能。之后运行 `npx skills update` 即可拉取更新的版本。

## 从包安装 [#install-from-the-package]

这些技能也随 npm 包一同发布。从包中安装可以让它们与 lockfile 中的 Livemark 版本保持一致，而网站始终提供最新版本：

```bash
npx skills add ./node_modules/livemark/skills
```

## 使用技能 [#use-them]

你不需要亲自调用技能。智能体会读取每个技能的描述，并在任务匹配时加载它。例如，要求新增一个博客栏目会加载 `livemark-configuration`，要求新写一篇文章会加载 `livemark-authoring`。如果你的智能体支持按名称调用技能，也可以直接调用某个技能，例如在 Claude Code 中使用 `/livemark-customization`。

## 另请参阅 [#see-also]

- [AI 智能体](/zh/customization/ai-agents/#agent-skills)：用同样的方式发布你自己项目的技能。
