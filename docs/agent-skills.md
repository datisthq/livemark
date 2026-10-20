---
title: Agent Skills
description: Teach your coding agent to write, configure and customize a Livemark site.
path: /agent-skills/
icon: sparkles
order: 5
---

# Agent Skills

Livemark ships [Agent Skills](https://agentskills.io/) that tell coding agents such as Claude Code, Cursor and Codex how a Livemark project works. Once installed, your agent knows where articles go, which config options exist and how to override the UI. You don't have to explain any of it in the prompt.

| Skill                    | Your agent uses it when                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `livemark-authoring`     | adding or editing Markdown articles, frontmatter, images and patches |
| `livemark-configuration` | editing `livemark.config.ts`: metadata, globs, sections, navigation  |
| `livemark-customization` | theming, escaping components or adding custom routes                 |

## Install from the website

livemark.dev publishes its skills under `/.well-known/agent-skills/`, so the [`skills` CLI](https://github.com/vercel-labs/skills) can install them from the site URL. Run this at your project root:

```bash
npx skills add https://livemark.dev
```

It asks which skills and agents to install for. To skip the prompts, pass them as flags:

```bash
npx skills add https://livemark.dev --skill livemark-authoring --agent claude-code
```

Add `--global` to install for your user instead of the project, and `--list` to see what's available without installing anything. Run `npx skills update` later to pull newer versions.

## Install from the package

The skills also ship inside the npm package. Installing them from there keeps them matched to the Livemark version in your lockfile, while the website always serves the latest release:

```bash
npx skills add ./node_modules/livemark/skills
```

## Use them

You don't need to invoke a skill yourself. Agents read each skill's description and load it when a task matches. For example, asking for a new blog section loads `livemark-configuration`, and asking for a new article loads `livemark-authoring`. If your agent supports invoking skills by name, you can also call one directly, as with `/livemark-customization` in Claude Code.

## See also

- [AI Agents](/customization/ai-agents/#agent-skills) — publish your own project's skills the same way.
