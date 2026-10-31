---
title: Links
path: /authoring/links/
icon: link
order: 3
---

# Links

## Internal Links

Link to other pages in your documentation:

```md
[Getting Started](/introduction/)
```

Renders as: [Getting Started](/introduction/)

## External Links

Link to external resources:

```md
[GitHub](https://github.com)
```

Renders as: [GitHub](https://github.com)

## Anchor Links

Link to a specific heading — on the current page with the `#id` alone, on another page after its path:

```md
[See Auto Links](#auto-links)
[See Custom Heading IDs](/authoring/headings/#custom-ids)
```

Renders as: [See Auto Links](#auto-links) and [See Custom Heading IDs](/authoring/headings/#custom-ids)

## Links to Markdown Files

Link to another article by its file, relative to the current one, as you would on GitHub. The link points at the page built from that file, honouring its `path`, and at its translation for a reader of another language:

```md
[Headings](./headings.md)
[Custom IDs](./headings.md#custom-ids)
```

Renders as: [Headings](./headings.md) and [Custom IDs](./headings.md#custom-ids)

A link to a Markdown file that no article comes from is left as written, and fails the build as a broken link.

## Auto Links

URLs are automatically converted to links:

```md
https://github.com/datisthq/livemark
```

Renders as: https://github.com/datisthq/livemark
