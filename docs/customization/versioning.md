---
title: Versioning
description: Publish docs for several releases side by side with sections or separate deploys.
path: /customization/versioning/
icon: git-branch
order: 9
---

# Versioning

Livemark has no dedicated versioning feature — the building blocks it already has cover the two common shapes. Pick by how far apart your versions are:

- **One site, a section per version** — a few versions whose docs live on one branch.
- **One deploy per version** — long-lived majors maintained on their own branches.

Most projects only need to keep the latest docs plus the previous major. If old releases only need their notes, a [changelog section](/customization/article-sections/#changelog-sections) is enough.

## A section per version

Keep each older version's articles in its own folder and give them `path`s under a version prefix. The current docs stay at `/`, and each older version becomes a section:

```text
docs/
  getting-started.md   # path: /getting-started/
v1/
  getting-started.md   # path: /v1/getting-started/
```

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "Acme",
  include: ["docs/**/*.md", "v1/**/*.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    {
      title: "v1",
      prefix: "/v1/",
      icon: "archive",
      siteTitle: "Acme v1",
    },
  ],
})
```

Longest-prefix matching routes every `/v1/…` article into the `v1` section, so it gets its own sidebar tree while the rest of the site keeps the current docs. `siteTitle` relabels the brand next to the logo inside that section, so a reader always sees which version they are on. Set `position: "sidebar"` to keep version tabs out of the header.

To warn readers on old pages, start each with a callout:

```markdown
:::warning
You are reading the docs for v1. [See the latest version](/getting-started/).
:::
```

Things to know:

- Search indexes the whole site, so results include every version's articles.
- Copying a folder per version duplicates content; freeze the old folder and only fix it when necessary.

## One deploy per version

When each major lives on its own branch (`main`, `v1`, …), build each branch as its own site and serve it from its own address — a subdomain (`v1.docs.example.com`) or a sub-path (`docs.example.com/v1/`) with [`base`](/deployment/github-pages/#configure-base-for-project-sites).

```typescript title="livemark.config.ts (v1 branch)"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://docs.example.com/v1",
  base: command => (command === "build" ? "/v1" : undefined),
  title: "Acme v1",
  banner: "You are reading the v1 docs · [Go to the latest →](https://docs.example.com/)",
  include: "docs/**/*.md",
})
```

Link the deploys to each other with a `custom` section or a header [link](/customization/external-links/), which acts as a version switcher:

```typescript title="livemark.config.ts (main branch)"
sections: [
  { title: "Docs", prefix: "/" },
  { title: "v1", type: "custom", url: "https://docs.example.com/v1/", icon: "archive" },
]
```

Each deploy has its own search index, sitemap and `llms.txt`, so versions never mix. The cost is one build and one CI job per maintained branch — see [Deployment](/deployment/) for host setups; most hosts deploy branches to their own URLs out of the box.

## See also

- [Article Sections](/customization/article-sections/) — section types, prefixes and matching.
- [Site Metadata](/customization/site-metadata/) — the `banner`, `title` and `site` fields used above.
