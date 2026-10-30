---
title: 贡献指南
description: 如何在本地搭建 Livemark、提出变更并发布新版本。
icon: heart-handshake
path: /contributing/
order: -1
---

Livemark 是一个开源项目，我们非常欢迎你的帮助，无论是修复 bug、完善文档，还是提出新功能。本指南会带你走完把一项变更从编辑器带到正式发布所需的全部步骤。

## 快速开始 {#quick-start}

你需要 [Node.js](https://nodejs.org/) 24+ 和 [pnpm](https://pnpm.io/) 11+。然后：

```bash
git clone https://github.com/datisthq/livemark.git
cd livemark
pnpm install
pnpm start
```

`pnpm start` 会基于本仓库自身的 `docs/` 启动开发服务器，让你在修改 Livemark 的同时，在浏览器中查看效果。对 `source/` 或 `docs/` 的修改会自动重新加载。

## 仓库结构 {#repository-layout}

```
livemark/
├── source/             # all package code (compiles into build/)
│   ├── actions/        # build-time orchestration (config, changelog)
│   ├── commands/       # `livemark <cmd>` CLI entrypoints
│   ├── components/     # React components (overridable via .livemark/)
│   ├── elements/       # shadcn-style primitives (overridable)
│   ├── styles/         # base CSS (overridable)
│   ├── helpers/        # internal utilities (private)
│   ├── hooks/          # public React hooks
│   ├── utils/          # public utilities (e.g. cn)
│   ├── plugins/        # Vite plugins and the twoslash stage
│   ├── routes/         # TanStack Start routes
│   ├── models/         # Zod schemas
│   ├── content/        # derivations over the loaded articles
│   └── vite.config.ts  # the Vite config consumers run against
├── build/              # compiled JS, used by Node CLI
├── skills/             # agent skills shipped to people who install Livemark
├── docs/               # this site's content
├── blog/               # this site's blog posts
└── livemark.config.ts  # this site's livemark config
```

`source/` 和 `build/` 都会随 npm 包一同发布：Node 加载 `build/*.js`，而 Vite 则打包 `source/*` 中未编译的 TS，使字面量形式的 `.ts` 导入扩展名得以解析。

## 本地命令 {#local-commands}

| 命令               | 作用                                |
| ------------------ | ----------------------------------- |
| `pnpm start`       | 基于本仓库的文档运行开发服务器      |
| `pnpm build:docs`  | 文档站点的生产构建                  |
| `pnpm build`       | 编译 `source/` → `build/`（`tsgo`） |
| `pnpm check:types` | 类型检查（不输出文件）              |
| `pnpm check:lint`  | 通过 vite-plus 进行格式检查 + lint  |
| `pnpm check`       | lint + 类型检查                     |
| `pnpm format`      | 自动修复格式                        |
| `pnpm test:unit`   | 运行单元测试（Vitest）              |
| `pnpm test`        | lint + 类型检查 + 单元测试          |

当 `pnpm test` 全部通过且 `pnpm build:docs` 构建成功时，变更就可以推送了。

## 代码约定 {#code-conventions}

- **TypeScript**：已启用严格模式。没有明确理由时，不要使用 `any`、`as` 类型断言或非空断言 `!`；如有使用，请在 PR 中指出。
- **导入**：使用带 `.ts(x)` 扩展名的完整 ESM 路径（`from "./foo.ts"`）。Tsgo 会在输出时通过 `rewriteRelativeImportExtensions` 将其重写为 `.js`。
- **注释**：为导出项编写文档注释。`//` 注释必须指明它所防止的具体错误，长度不超过约三行，且注释数量绝不能多于代码；设计理由和历史应记录在 git 中。
- **文件布局**：高层的公共项放在顶部，私有辅助函数放在底部。
- **测试**：将单元测试放在代码旁的 `<module>.unit.ts` 中。不要写 “Arrange/Act/Assert” 注释，结构本身应当一目了然。
- **格式化**：通过 `pnpm format` 使用 vite-plus。2 空格缩进、不加分号、双引号、每行 90 列。

## 提出变更 {#proposing-a-change}

1. **先开一个 issue**，适用于任何比错别字或小 bug 更大的改动。在写代码之前就方向达成一致要容易得多。
2. **从 `main` 创建分支**，使用简短且具描述性的名称（例如 `fix-mobile-toc`、`feat-yaml-frontmatter`）。
3. **保持提交历史聚焦**。Livemark 使用 [Conventional Commits](https://www.conventionalcommits.org/)，前缀决定 release-please 的行为：
   - `fix:`：已发布包中的 bug 修复 → patch 版本
   - `feat:`：已发布包中的新功能 → minor 版本
   - `chore:`、`docs:`、`refactor:`、`test:`：不触发发布；用于 CI、工具链、依赖、文档站点以及安装者永远看不到的其他任何内容
   - 未经维护者同意发布 major 版本，切勿将提交标记为破坏性变更（`!` 或 `BREAKING CHANGE:` 页脚）
4. 推送前**运行 `pnpm test` 和 `pnpm build:docs`**。
5. **向 `main` 发起 PR**。说明变更的*原因*（附上 issue 链接），任何 UI 变更都请附上截图，并指出需要评审者特别关注的地方。

## 发布 {#releases}

发布由 [release-please](https://github.com/googleapis/release-please) 驱动。`feat` 或 `fix` 合入 `main` 后，会开启一个带有计算出的版本号和更新日志的 Release PR；合并该 PR 就会打标签、发布包并创建 GitHub release。维护者从不手动升级版本号：`.release/manifest.json` 由 release-please 维护。

## 获取帮助 {#where-to-find-help}

- **Bug 和功能请求**：[GitHub Issues](https://github.com/datisthq/livemark/issues)
- **讨论 / 想法**：[GitHub Discussions](https://github.com/datisthq/livemark/discussions)
- **源代码**：[github.com/datisthq/livemark](https://github.com/datisthq/livemark)

感谢你帮助 Livemark 变得更好。
