---
title: Headings
icon: heading
order: 2
pathname: /markdown/headings/
---

# Headings

Headings automatically generate anchor IDs for linking.

## Auto-generated IDs

```md
## My Heading
```

Renders as `<h2 id="my-heading">My Heading</h2>`. IDs are generated using GitHub-compatible slugging.

## Custom Heading IDs [#custom-ids]

Override the auto-generated ID with `[#custom-id]` syntax:

```md
## My Heading [#custom-id]
```

This generates `<h2 id="custom-id">My Heading</h2>`. Link to it with `#custom-id`. This heading itself uses `[#custom-ids]`.

## Heading Levels

Use h2–h4 for content structure. The h1 is reserved for the page title.

Deeper headings (h5, h6) are supported but won't appear in the table of contents.

## TOC Control

Control whether headings appear in the table of contents using annotations.

Hide a heading from the TOC while keeping it visible in the rendered output:

```md
## Visible Heading [!toc]
```

The heading renders normally on the page but is excluded from the table of contents.

Create a TOC-only heading that appears in the table of contents but not in the rendered output:

```md
## Hidden Heading [toc]
```

The heading appears in the TOC for navigation but is removed from the page content.

## Anchor Links on Hover

Headings with IDs show a link icon on hover. Click to copy the anchor URL for sharing.

## Inline Table of Contents

Insert a table of contents anywhere in your content using the `::toc` directive:

```md
::toc
```

Limit the depth with `maxLevel`:

```md
::toc{maxLevel=2}
```

Renders as:

::toc{maxLevel=2}
