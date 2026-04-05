---
title: Text Formatting
icon: type
order: 5
pathname: /docs/markdown/text-formatting/
---

# Text Formatting

## Bold and Italic

```md
**bold text** and _italic text_ and **_bold italic_**
```

Renders as: **bold text** and _italic text_ and **_bold italic_**

## Strikethrough

```md
~~deleted text~~
```

Renders as: ~~deleted text~~

## Inline Code

```md
Use `const x = 1` for inline code.
```

Renders as: Use `const x = 1` for inline code.

## Inline Code Highlighting

Add language-specific syntax highlighting to inline code with a `{:lang}` prefix:

```md
Use `{:ts}const x = 1` for inline TypeScript or `{:py}print("hello")` for Python.
```

Renders as:

Use `{:ts}const x = 1` for inline TypeScript or `{:py}print("hello")` for Python.

## Blockquotes

```md
> This is a blockquote.
```

Renders as:

> This is a blockquote.

## Lists

Unordered and ordered lists:

- First item
- Second item
  - Nested item

1. Step one
2. Step two
3. Step three

## Task Lists

```md
- [x] Completed task
- [ ] Pending task
```

Renders as:

- [x] Completed task
- [ ] Pending task

## Horizontal Rules

```md
---
```

---

## Footnotes

Add footnotes using `[^id]` references and definitions:

```md
Here is a sentence with a footnote[^1] and another[^note].

[^1]: This is a numbered footnote.

[^note]: Footnotes can use descriptive identifiers too.
```

Renders as:

Here is a sentence with a footnote[^1] and another[^note].

[^1]: This is a numbered footnote.

[^note]: Footnotes can use descriptive identifiers too.

## Definition Lists

Define terms with their descriptions:

```md
Remark
: A markdown processor powered by plugins

Rehype
: An HTML processor powered by plugins

Unified
: An interface for processing content with syntax trees
: The foundation for both remark and rehype
```

Renders as:

Remark
: A markdown processor powered by plugins

Rehype
: An HTML processor powered by plugins

Unified
: An interface for processing content with syntax trees
: The foundation for both remark and rehype

## Abbreviations

Add tooltips to abbreviations using the `:abbr` directive:

```md
The :abbr[HTML]{title="HyperText Markup Language"} standard is maintained by :abbr[W3C]{title="World Wide Web Consortium"}.
```

Renders as:

The :abbr[HTML]{title="HyperText Markup Language"} standard is maintained by :abbr[W3C]{title="World Wide Web Consortium"}.

## Emoji

Use GitHub-style emoji shortcodes:

```md
:rocket: Launch :tada: Celebrate :heart: Love :warning: Careful :white_check_mark: Done
```

Renders as:

:rocket: Launch :tada: Celebrate :heart: Love :warning: Careful :white_check_mark: Done

See the [full emoji list](https://github.com/ikatyang/emoji-cheat-sheet) for available shortcodes.
