---
description: Livemark 配置放在哪里、控制哪些内容，以及顶层选项一览。
path: /customization/config-file/
icon: layers
order: 1
---

# 配置文件

:::tip
配置文件是可选的。默认情况下，Livemark 会读取你运行它所在文件夹中的所有 `.md` 文件。
:::

Livemark 通过项目根目录下的单个文件进行配置：**`livemark.config.ts`**。把它放在 `package.json` 旁边，导出一个 `defineConfig({...})` 调用，Livemark 就会自动识别它，无需任何命令行参数或环境变量。

## 最小配置 [#minimal-config]

所有字段都是可选的。最小的有效配置就是一个空调用：

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({})
```

这会读取项目下的所有 `.md` 文件（默认 `include: "**/*.md"`），并使用标准的 Livemark 主题渲染：侧边栏、搜索、语法高亮、深色模式，全部采用默认设置。

## 可配置的内容 [#what-you-can-configure]

每个字段都有合理的默认值。完整列表：

| 选项             | 类型                                               | 用途                                                                            |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------------------------------- |
| `include`        | `string \| string[]`                               | 内容文件的 glob。默认：`"**/*.md"`。                                            |
| `exclude`        | `string \| string[]`                               | 要跳过的 glob（草稿、片段等）。                                                 |
| `title`          | `string`                                           | 显示在顶栏和 `<title>` 中的站点标题。默认：`"Livemark"`。                       |
| `description`    | `string`                                           | 用于 SEO/Open Graph 的 meta 描述。默认：`"Markdown site generator"`。           |
| `site`           | `string`                                           | 站点的规范 URL，生成 sitemap 时必需。                                           |
| `favicon`        | `string`                                           | favicon 图片的路径，相对于项目根目录。                                          |
| `logo`           | `string`                                           | 顶栏中使用的 logo 图片路径（未设置时回退到 favicon）。                          |
| `banner`         | `string`                                           | 显示在顶栏上方横条中的行内 Markdown 公告。                                      |
| `breadcrumbs`    | `boolean`                                          | 在每篇文章标题上方显示文件夹层级的面包屑导航。默认：`true`。                    |
| `codeThemeLight` | Shiki 主题名                                       | 浅色模式的语法主题。默认：`"catppuccin-latte"`。                                |
| `codeThemeDark`  | Shiki 主题名                                       | 深色模式的语法主题。默认：`"catppuccin-mocha"`。                                |
| `sections`       | [`Section[]`](/zh/customization/article-sections/) | 将内容拆分为文档 / 博客 / 更新日志，各自拥有 URL 前缀。                         |
| `links`          | [`Link[]`](/zh/customization/external-links/)      | 显示在顶栏或侧边栏中的自定义链接。                                              |
| `patches`        | [`Patch[]`](/zh/customization/article-patches/)    | 在配置中覆盖 Markdown 文件的 frontmatter，无需编辑文件。                        |
| `contentSignals` | [`ContentSignals`](/zh/customization/ai-agents/)   | 发布在 `robots.txt` 中的 AI 使用偏好。默认：全部为 `true`。                     |
| `skills`         | `string \| string[]`                               | 要作为[智能体技能](/zh/customization/ai-agents/)发布的 `SKILL.md` 文件的 glob。 |

完整的 schema 位于 [`source/models/config.ts`](https://github.com/datisthq/livemark/blob/main/source/models/config.ts)：`defineConfig` 会用 Zod 依据它进行校验，因此拼写错误会在启动时给出清晰的报错。

## 完整示例 [#worked-example]

大多数真实站点最终都类似这样：

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "My docs",
  description: "Documentation for my project",
  site: "https://docs.example.com",
  include: ["docs/**/*.md", "blog/**/*.md"],
  exclude: "docs/**/_*",
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
  ],
  links: [
    {
      url: "https://github.com/example/project",
      title: "GitHub",
      icon: "github",
    },
  ],
})
```

## 下一步 [#where-to-go-next]

- [站点元数据](/zh/customization/site-metadata/)：标题、描述、favicon、logo。
- [文章栏目](/zh/customization/article-sections/)：将内容拆分到多个 URL 前缀下（文档 / 博客 / 更新日志）。
- [外部链接](/zh/customization/external-links/)：顶栏和侧边栏链接。
- [语法主题](/zh/customization/syntax-themes/)：选择或扩展 Shiki 主题。
- [文章补丁](/zh/customization/article-patches/)：在配置中覆盖 frontmatter。
- [覆盖（escape）](/zh/customization/overriding-escaping/)：替换任意内置组件或样式表。
- [自定义路由](/zh/customization/custom-routes/)：添加完全自定义的页面。
