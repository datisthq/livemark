---
title: Customization
description: How to customize your Livemark project.
path: /customization/
icon: sliders-horizontal
order: 3
---

# Customization

Livemark exposes a handful of hooks for tailoring how your site looks, what it contains, and how files flow through the build. Each area has its own page.

## Topics

:::card{title="Configuration" href="/customization/configuration-file/" icon="layers"}
`livemark.config.ts` basics — `include`/`exclude` globs for your content.
:::

:::card{title="Site Metadata" href="/customization/site-metadata/" icon="globe"}
Site title, description, canonical URL, logo, and favicon.
:::

:::card{title="Syntax Themes" href="/customization/syntax-themes/" icon="palette"}
Pick light and dark Shiki themes for fenced code blocks.
:::

:::card{title="External Links" href="/customization/external-links/" icon="link"}
Add external links to the header or the sidebar.
:::

:::card{title="Article Sections" href="/customization/article-sections/" icon="layout-panel-left"}
Organize content into Docs, Blog, and Changelog sections.
:::

:::card{title="Article Groups" href="/customization/article-groups/" icon="folder-tree"}
Label sidebar groups within a section using the `group` frontmatter field.
:::

:::card{title="Article Patches" href="/customization/article-patches/" icon="pencil-ruler"}
Override article frontmatter from config, without editing the file.
:::

:::card{title="Module Escaping" href="/customization/module-escaping/" icon="file-pen-line"}
Shadow any Livemark component, element, or stylesheet via `.livemark/`.
:::

:::card{title="Custom Routes" href="/customization/custom-routes/" icon="route"}
Author new pages in `.livemark/routes/` alongside your markdown.
:::
