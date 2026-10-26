---
description: 用一份配置以多种语言发布你的文档。
path: /customization/translations/
icon: languages
order: 8
---

# 翻译

`languages` 数组可以把一个项目变成多语言站点。第一种语言是默认语言，保留原有的 URL；其他每种语言都在其语言代码下提供，因此西班牙语版的 `/guide/` 位于 `/es/guide/`。

## 基本用法 [#basic-usage]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: { en: "Acme Docs", es: "Documentación de Acme" },
  languages: [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ],
})
```

然后把翻译放在原文旁边，并在扩展名前加上语言代码：

:::filetree

- docs/
  - guide.md
  - guide.es.md
  - guide/
    - install.md

:::

`guide.es.md` 与 `guide.md` 使用相同的 frontmatter `path`（`/guide/`），Livemark 会在 `/es/guide/` 提供它。两个文件通过这个路径配对，因此顶栏中的语言选择器可以在它们之间切换。

## 语言 [#languages]

| 字段       | 类型                | 默认值        | 用途                                                     |
| ---------- | ------------------- | ------------- | -------------------------------------------------------- |
| `code`     | `string`            | —             | URL 片段和文件后缀，小写（例如 `es`）。                  |
| `label`    | `string`            | —             | 显示在语言选择器中的名称。                               |
| `locale`   | `string`            | `code`        | 用于 `<html lang>`、`hreflang` 和日期的 BCP 47 标签。    |
| `dir`      | `"ltr" \| "rtl"`    | 取决于 locale | 文字方向；阿拉伯语、希伯来语、波斯语、乌尔都语等为 rtl。 |
| `flag`     | `string`            | 取决于 locale | 选择器中旗帜对应的两字母国家代码（例如 `br`）。          |
| `messages` | `Partial<Messages>` | 内置翻译      | 对单个界面字符串的覆盖。                                 |

顶栏中的选择器会显示每种语言的旗帜。默认取自 locale 的地区（`pt-BR` → 巴西），否则取与该语言关联最紧密的国家（`en` → 英国）；设置 `flag` 可以选择其他旗帜。Livemark 未内置旗帜的国家不显示旗帜。

没有 `languages` 时，站点的行为与之前完全相同：只有一种语言，即位于 `/` 的英语。

## 标记文章的语言 [#marking-an-articles-language]

文件的语言按以下顺序确定：

1. frontmatter 中的 `language: es`，适合文件名需要保持自由的情况，例如 `blog/hola.md`；
2. 指明某个已配置语言的 `.<code>.md` 后缀，例如 `guide.es.md`；
3. 否则，使用默认语言。

不对应任何已配置语言的后缀会被视为文件名的一部分，因此 `vite.config.md` 仍然是一篇英语文章。

## 翻译配置中的文本 [#translating-config-texts]

`title`、`description` 和 `banner`，栏目的 `title`、`siteTitle` 和 `siteDescription`，以及链接的 `title`，都既可以是字符串，也可以按语言代码分别给出值。缺少某种语言时，回退到默认语言的值。

```typescript
sections: [
  { title: { en: "Guide", es: "Guía" }, prefix: "/" },
  { title: "Blog", prefix: "/blog/", type: "blog" },
]
```

文章栏目和博客栏目会为每种语言复制一份：西班牙语站点获得 `/es/` 和 `/es/blog/`，各自拥有独立的侧边栏、标签和 RSS 订阅源。更新日志栏目同样会复制到 `/es/changelog/`：每个版本外围的页面是西班牙语的，而版本说明保持更新日志文件中的原文，并将英语页面标为规范页面，因此它们不会出现在 sitemap 中。栏目前缀不能以某种语言的代码开头，上例中的 `/es/` 已保留给西班牙语。

## 未翻译的页面 [#untranslated-pages]

某种语言的侧边栏仍会列出没有对应翻译的默认语言文章，并以默认语言的代码标注，链接到原始页面。语言前缀下不会复制任何内容，因此搜索引擎只会看到每个页面一次。

## 界面字符串 [#ui-strings]

Livemark 自身的标签文字（“On this page”、“Search docs...”、“Edit on GitHub” 等）内置英语、德语、西班牙语、法语、日语、俄语和中文版本，并根据语言的 `locale` 选用。你可以按语言覆盖其中任意一项：

```typescript
languages: [
  { code: "en", label: "English" },
  {
    code: "es",
    label: "Español",
    messages: { "toc.title": "En esta página", "search.placeholder": "Buscar…" },
  },
]
```

未知的键会导致配置检查失败，因此拼写错误不会悄无声息地保留英文文本。对于 Livemark 未内置的语言，请在 `messages` 中设置所有需要翻译的字符串。完整的键列表见 `source/models/message.ts` 中的 `Messages` schema。

你在 `.livemark/` 下覆盖的组件可以通过 `useMessages` hook 读取相同的字符串：

```tsx
import { useMessages } from "livemark/hooks/site"

export function Footer() {
  const t = useMessages()
  return <p>{t("page.updated", { date: "Mar 7, 2025" })}</p>
}
```

## 每种语言获得的内容 [#what-each-language-gets]

- 来自该语言的 `<html lang>` 和 `dir`，以及按其 locale 格式化的日期
- 翻译之间的 `hreflang` 链接、指向默认语言的 `x-default` 链接，以及 `og:locale`
- 仅限当前语言的搜索
- 其前缀下独立的 `llms.txt` 和 Markdown 副本
- 独立的博客 RSS 订阅源，以及预渲染并列入 sitemap 的首页
