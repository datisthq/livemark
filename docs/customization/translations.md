---
description: Publish your docs in several languages with one config.
path: /customization/translations/
icon: languages
order: 8
---

# Translations

The `languages` array turns one project into a multi-language site. The first language is the default and keeps its URLs; every other language is served under its code, so `/guide/` in Spanish lives at `/es/guide/`.

## Basic usage

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

Then put a translation next to its original, with the language code before the extension:

:::filetree

- docs/
  - guide.md
  - guide.es.md
  - guide/
    - install.md

:::

`guide.es.md` keeps the same frontmatter `path` as `guide.md` — `/guide/` — and Livemark serves it at `/es/guide/`. The two files are paired by that path, so the language picker in the header jumps between them.

## Languages

| Field      | Type                | Default             | Purpose                                                           |
| ---------- | ------------------- | ------------------- | ----------------------------------------------------------------- |
| `code`     | `string`            | —                   | URL segment and file suffix, lowercase (e.g. `es`).               |
| `label`    | `string`            | —                   | Name shown in the language picker.                                |
| `locale`   | `string`            | `code`              | BCP 47 tag for `<html lang>`, `hreflang` and dates.               |
| `dir`      | `"ltr" \| "rtl"`    | from the locale     | Text direction; Arabic, Hebrew, Persian, Urdu and others are rtl. |
| `flag`     | `string`            | from the locale     | Two-letter country code of the flag in the picker (e.g. `br`).    |
| `messages` | `Partial<Messages>` | bundled translation | Overrides for single UI strings.                                  |

The picker in the header shows each language's flag. It defaults to the locale's region (`pt-BR` → Brazil), else the country most tied to the language (`en` → United Kingdom); set `flag` to pick another. A country Livemark does not bundle a flag for shows no flag.

Without `languages`, a site behaves exactly as before: one English language at `/`.

## Marking an article's language

A file's language comes from, in order:

1. frontmatter `language: es` — useful when the file name should stay free, like `blog/hola.md`;
2. a `.<code>.md` suffix naming a configured language — `guide.es.md`;
3. otherwise, the default language.

A suffix that names no configured language is part of the file name, so `vite.config.md` stays an English article.

## Translating config texts

`title`, `description` and `banner`, a section's `title`, `siteTitle` and `siteDescription`, and a link's `title` accept either a string or one value per language code. A missing language falls back to the default language's value.

```typescript
sections: [
  { title: { en: "Guide", es: "Guía" }, prefix: "/" },
  { title: "Blog", prefix: "/blog/", type: "blog" },
]
```

Article and blog sections are mirrored for every language: the Spanish site gets `/es/` and `/es/blog/`, each with its own sidebar, tags and RSS feed. Changelog sections are mirrored too, at `/es/changelog/`: the page around each release is in Spanish, while the release notes stay as written in the changelog file and name the English page as canonical. A section prefix may not start with a language's code — `/es/` above is reserved for Spanish.

## Untranslated pages

A language's sidebar still lists the default-language articles it has no translation for, marked with the default language's code and linking to the original page. Nothing is duplicated under the language's prefix, so search engines see each page once.

## UI strings

Livemark's own labels — "On this page", "Search docs...", "Edit on GitHub" and the rest — ship in English, German, Spanish, French, Japanese, Russian and Chinese, picked by the language's `locale`. Override any of them per language:

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

An unknown key fails the config check, so a typo cannot silently keep the English text. For a language Livemark does not bundle, set every string you want translated in `messages`. The full key list is the `Messages` schema in `source/models/message.ts`.

A component you shadow under `.livemark/` reads the same strings with the `useMessages` hook:

```tsx
import { useMessages } from "livemark/hooks/site"

export function Footer() {
  const t = useMessages()
  return <p>{t("page.updated", { date: "Mar 7, 2025" })}</p>
}
```

## What each language gets

- `<html lang>` and `dir` from the language, and dates formatted in its locale
- `hreflang` links between translations, an `x-default` link to the default language, and `og:locale`
- search limited to the current language
- its own `llms.txt` and Markdown twins under its prefix
- its own blog RSS feeds, and its home page prerendered and listed in the sitemap
