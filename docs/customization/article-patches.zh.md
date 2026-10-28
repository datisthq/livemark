---
description: 在配置中覆盖文章的 frontmatter，无需改动文件本身。
path: /customization/article-patches/
icon: pencil-ruler
order: 4
---

# 文章补丁

有时一个 Markdown 文件既是站点内容，又会在别处被读取：例如由 GitHub 渲染的 `README.md`，或者另一个项目中共享的规范。往里添加仅供 Livemark 使用的前置元数据 frontmatter，会污染另一处的展示。

`patches` 让你可以在 `livemark.config.ts` 中为特定文件注入 frontmatter 字段，而不必编辑磁盘上的文件。

## 基本用法 [#basic-usage]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: ["README.md", "docs/**/*.md"],
  patches: [
    {
      file: "README.md",
      article: {
        title: "Overview",
        icon: "sparkles",
        order: 0,
      },
    },
  ],
})
```

磁盘上的文件保持干净，但 Livemark 渲染它时，就好像上面的 YAML 写在文件开头一样。

## 字段 [#fields]

| 字段      | 类型               | 用途                                                  |
| --------- | ------------------ | ----------------------------------------------------- |
| `file`    | `string`           | 相对于集合的路径，例如 `"README.md"`、`"docs/a.md"`。 |
| `article` | `Partial<Article>` | 除 `content` 外的任意 frontmatter 字段。              |

像 `format` 这样的文章字段也同样适用。无论扩展名是什么，都将文件固定为纯 Markdown：

```typescript
{ file: "CHANGELOG.md", article: { format: "md" } }
```

匹配方式是与 Livemark 收集到的文件路径做精确的字符串比较。如果路径没有匹配到任何文章，补丁会静默地不起作用。当你防御性地为一个可能存在也可能不存在的文件打补丁时，这一点很方便。

## 合并语义 [#merge-semantics]

补丁的 `article` 字段会合并到文件自身的 frontmatter 之上。补丁中未指定的内容保留其正常值（来自文件，或来自 Livemark 的自动默认值）。

因此，一个没有 frontmatter 的 README 加上：

```typescript
{ file: "README.md", article: { title: "Overview" } }
```

会渲染为一篇标题为 “Overview” 的文章。其他所有字段（描述、图标、路径等）都回退到默认值。

## 不能打补丁的内容 [#what-you-cant-patch]

`content` 键会在加载配置时被拒绝：

```typescript
// Throws at startup:
{ file: "README.md", article: { content: "replaced" } }
```

补丁用于元数据；文件的内容永远是文件本身的内容。

## 另请参阅 [#see-also]

- [Frontmatter](/zh/authoring/frontmatter/)：所有可设置的字段，无论是写在文件中还是通过补丁设置。
- [配置](/zh/customization/config-file/)：决定补丁可以匹配哪些文件的 `include` glob。
