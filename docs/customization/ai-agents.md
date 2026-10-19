---
title: AI Agents
description: Serve Markdown, llms.txt, content signals and agent skills to AI agents.
path: /customization/ai-agents/
icon: bot
order: 9
---

# AI Agents

Every `livemark build` publishes your site in the forms AI agents look for, next to the HTML that browsers get. You don't need to configure anything for this. The two options below only adjust it.

## What the build emits

| File                                   | Purpose                                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `<page>/index.md`                      | A Markdown twin of every article, beside its `index.html`, with includes resolved        |
| `/llms.txt`                            | An [llms.txt](https://llmstxt.org/) index linking every twin, grouped by section         |
| `/index.md`                            | The home page's twin, or a copy of `llms.txt` when no article sits at `/`                |
| `/robots.txt`                          | Gains a `Content-Signal` line stating how automated systems may use your content         |
| `/_headers`                            | A `Link` header on the home page pointing at `llms.txt`, `index.md` and the skills index |
| `/.well-known/agent-skills/index.json` | An [Agent Skills](https://agentskills.io/) discovery index, when `skills` is set         |

Each article page also carries `<link rel="alternate" type="text/markdown">` pointing at its twin.

A file you ship under `.livemark/public/` with the same name replaces the generated one. `_headers` is the one exception: your rules are kept and the generated `Link` rule is appended after them. The files are written only by `livemark build`, so `livemark start` does not serve them.

## Content signals

`contentSignals` controls the [Content Signals](https://contentsignals.org/) line in `robots.txt`. All three signals default to `true`:

```ts title="livemark.config.ts"
export default defineConfig({
  contentSignals: {
    search: true, // build a search index and show links to your pages
    aiInput: true, // feed pages to a model answering a question in real time
    aiTrain: false, // train or fine-tune models on your content
  },
})
```

The line it produces sits in the `User-agent: *` group: `Content-Signal: search=yes, ai-input=yes, ai-train=no`.

## Agent skills

If your project ships [Agent Skills](https://agentskills.io/specification), point `skills` at their `SKILL.md` files:

```ts title="livemark.config.ts"
export default defineConfig({
  skills: "skills/*/SKILL.md",
})
```

Each matched skill is published at `/.well-known/agent-skills/<name>/SKILL.md` and listed in `index.json` with a `sha256` digest. Its frontmatter needs a `name` (lowercase letters, digits and single hyphens) and a `description`, and the build fails if either is missing.

## Markdown on request

Agents ask for Markdown by sending `Accept: text/markdown`. A static host can't answer that on its own. On Cloudflare, Livemark ships a Worker that serves the twin to those requests and the HTML to everyone else. See [Cloudflare → Markdown for agents](/deployment/cloudflare/#markdown-for-agents).

## See also

- [Config File](/customization/config-file/) — every top-level option.
- [Custom Routes](/customization/custom-routes/) — static files under `.livemark/public/`.
