---
title: Frontmatter
path: /authoring/frontmatter/
icon: file-text
order: 1
---

# Frontmatter

每个 `.md` 文件顶部的 YAML 前置元数据 frontmatter 用于为文章附加元数据。所有字段都是可选的；缺少某个字段时，Livemark 会根据文件本身推导出合理的默认值。

```yaml
---
title: Getting Started
description: Your first Livemark project, in ten minutes.
icon: rocket
order: 1
---
```

## 文章元数据 [#article-metadata]

文章的标识与展示。

| 字段          | 类型                 | 默认值                        | 用途                                                                            |
| ------------- | -------------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `title`       | `string`             | 第一个 `#` 标题，否则为文件名 | 浏览器标签页标题、文章标题、导航标签。                                          |
| `label`       | `string`             | `title`                       | 当 `title` 较长时，在侧边栏和面包屑中使用的简短版本。                           |
| `description` | `string`             | —                             | `<meta name="description">` 以及 Open Graph 描述。                              |
| `icon`        | `string`             | —                             | Lucide 图标名称（例如 `rocket`、`book-open`）。没有图标的文章不会显示任何图标。 |
| `image`       | `string`             | —                             | Open Graph / 社交卡片图片（需要设置 `site`）。相对路径相对于该文件解析。        |
| `author`      | `string \| string[]` | —                             | 一个或多个作者名。                                                              |
| `date`        | `string`             | —                             | ISO 日期。决定博客栏目中的排序。                                                |
| `tags`        | `string[]`           | —                             | 博客栏目用它来生成 `/tags/<tag>/` 页面。                                        |

## 侧边栏设置 [#sidebar-settings]

文章在左侧导航中的显示方式。

| 字段      | 类型      | 默认值                | 用途                                                       |
| --------- | --------- | --------------------- | ---------------------------------------------------------- |
| `order`   | `number`  | —（不排序，位于中间） | 排序位置。参见下方的「排序规则」。                         |
| `sidebar` | `boolean` | `true`                | 设为 false 时，文章仍可通过 URL 访问，但不会显示在导航中。 |
| `toc`     | `boolean` | `true`                | 设为 false 时，隐藏右侧的目录。                            |

### 排序规则 [#ordering-rules]

`order` 采用两段式排序方案：

- 正数 `order` 排在最前面，按升序排列（`order: 1`、`2`、`3`……）。
- 没有 `order` 的文章排在其后，按自然顺序排列。
- 负数 `order` 排在末尾，`-1` 为最后一个，`-2` 为倒数第二个，依此类推。

这样你就可以把「快速上手」固定在顶部（`order: 1`），把「常见问题」固定在底部（`order: -1`），中间部分保持不变。

## URL [#url]

| 字段       | 类型     | 默认值                                | 用途                                                          |
| ---------- | -------- | ------------------------------------- | ------------------------------------------------------------- |
| `path`     | `string` | 项目根目录下转换为 slug 的文件名      | 覆盖 URL slug。需包含开头和结尾的斜杠。                       |
| `language` | `string` | `.<code>.md` 文件后缀，否则为默认语言 | 文章在[多语言站点](/zh/customization/translations/)中的语言。 |

## 无需编辑即可覆盖 [#overriding-without-editing]

如果你无法修改某个文件的 frontmatter（例如同时用作 GitHub 首页的 `README.md`），可以通过 [Article Patches](/zh/customization/article-patches/) 从 `livemark.config.ts` 注入相同的字段。

## 另请参阅 [#see-also]

- [Article Sections](/zh/customization/article-sections/) —— `order` 和 `date` 如何与博客和更新日志栏目配合使用。
- [Article Patches](/zh/customization/article-patches/) —— 通过配置设置 frontmatter，无需改动文件。
