---
title: 文本格式
path: /authoring/text-formatting/
icon: type
order: 5
---

# 文本格式

## 粗体与斜体 [#bold-and-italic]

```md
**bold text** and _italic text_ and **_bold italic_**
```

渲染效果：**粗体文本**、_斜体文本_ 和 **_粗斜体_**

## 删除线 [#strikethrough]

```md
~~deleted text~~
```

渲染效果：~~已删除的文本~~

## 行内代码 [#inline-code]

```md
Use `const x = 1` for inline code.
```

渲染效果：使用 `const x = 1` 表示行内代码。

## 行内代码高亮 [#inline-code-highlighting]

使用 `{:lang}` 前缀为行内代码添加特定语言的语法高亮：

```md
Use `{:ts}const x = 1` for inline TypeScript or `{:py}print("hello")` for Python.
```

渲染效果：

使用 `{:ts}const x = 1` 表示行内 TypeScript，或使用 `{:py}print("hello")` 表示 Python。

## 引用块 [#blockquotes]

```md
> This is a blockquote.
```

渲染效果：

> 这是一个引用块。

## 列表 [#lists]

无序列表和有序列表：

- 第一项
- 第二项
  - 嵌套项

1. 第一步
2. 第二步
3. 第三步

## 任务列表 [#task-lists]

```md
- [x] Completed task
- [ ] Pending task
```

渲染效果：

- [x] 已完成的任务
- [ ] 待完成的任务

## 分隔线 [#horizontal-rules]

```md
***
```

---

## 脚注 [#footnotes]

使用 `[^id]` 引用和定义来添加脚注：

```md
Here is a sentence with a footnote[^1] and another[^note].

[^1]: This is a numbered footnote.

[^note]: Footnotes can use descriptive identifiers too.
```

渲染效果：

这是一个带有脚注[^1]的句子，还有另一个脚注[^note]。

[^1]: 这是一个编号脚注。

[^note]: 脚注也可以使用描述性的标识符。

## 定义列表 [#definition-lists]

为术语给出对应的描述：

```md
Remark
: A markdown processor powered by plugins

Rehype
: An HTML processor powered by plugins

Unified
: An interface for processing content with syntax trees
: The foundation for both remark and rehype
```

渲染效果：

Remark
: 基于插件的 Markdown 处理器

Rehype
: 基于插件的 HTML 处理器

Unified
: 使用语法树处理内容的接口
: remark 和 rehype 共同的基础

## 缩写 [#abbreviations]

使用 `:abbr` 指令为缩写添加悬停提示：

```md
The :abbr[HTML]{title="HyperText Markup Language"} standard is maintained by :abbr[W3C]{title="World Wide Web Consortium"}.
```

渲染效果：

:abbr[HTML]{title="HyperText Markup Language"} 标准由 :abbr[W3C]{title="World Wide Web Consortium"} 维护。

## Emoji [#emoji]

使用 GitHub 风格的 emoji 短代码：

```md
:rocket: Launch :tada: Celebrate :heart: Love :warning: Careful :white_check_mark: Done
```

渲染效果：

:rocket: 发布 :tada: 庆祝 :heart: 喜爱 :warning: 注意 :white_check_mark: 完成

可用的短代码请参阅[完整的 emoji 列表](https://github.com/ikatyang/emoji-cheat-sheet)。
