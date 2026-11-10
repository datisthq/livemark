---
name: human-documentation
description: Use before committing a change — to find what AGENTS.md, CONTRIBUTING.md, the README, the skills and the docs site now falsely claim after the diff — and when deciding where a new fact or rule belongs.
---

# Documentation

Keep every document true when the code changes, and put each fact where the next reader will
find it.

## Keeping the docs true

Run this **before committing**, once the work is done and the diff is final.

```sh
git diff main...HEAD --stat
git diff main...HEAD
git status --short
```

The guard in `.scripts/-test/docs.unit.ts` already fails the build on a path or `pnpm` command
that no longer exists. That is the mechanical half. This is the other half: a paragraph that
still parses, still points at real files, and is no longer true.

### What falsifies a doc

Work through the diff asking each of these:

- **A rename.** Grep the docs for the _old_ name, not just the code — component, element, config
  field, directive, CLI flag, script, directory. This is the single most common miss.
- **A new or deleted command, script or source folder.** The command list and the code-structure
  list in `AGENTS.md`, and the tables in `CONTRIBUTING.md`, all enumerate them.
- **A changed default or constraint.** A config field's default, an include glob, a frontmatter
  field becoming required.
- **A rule that moved.** If a guard now enforces what prose used to ask for, say so — a rule
  enforced by a test and a rule enforced by hope read identically on the page.
- **A removed mechanism.** Search the docs for the thing you deleted. A paragraph explaining why
  we do X is worse than useless once X is gone.
- **A generated artefact.** `livemark/source/routeTree.gen.ts` is committed and goes stale quietly —
  neither `pnpm start` nor `pnpm build:docs` rewrites it, only their `.livemark/.serve` and
  `.livemark/.build` copies — so treat it as documentation and regenerate it (**`change-verification`**).

### Where to look

- `AGENTS.md` — the only one, at the repo root; the guard enforces that.
- `.agents/skills/*/SKILL.md` and `livemark/skills/*/SKILL.md` — including the `description`, which is what
  makes a skill get picked up at all. A skill whose body drifted is bad; a skill whose
  _description_ drifted is invisible. The shipped `livemark/skills/` reach every project that installs
  Livemark, so a change there is a `feat` or `fix`.
- `README.md`, `CONTRIBUTING.md` and the docs site under `livemark/docs/`, which is the user manual.
- Comments that assert a repo-wide invariant, not just local ones — the doc comment on
  `ESCAPABLE_FOLDERS`, a guard test's explanation of what it protects.

### Where a fact belongs

Whether a rule or lesson for agents goes in `AGENTS.md` or a skill: **`agent-documentation`**.

- How to **use** Livemark (a project's config, Markdown, escapes) → the shipped skill in `livemark/skills/`
  and the matching `livemark/docs/` page, kept in step.
- How to **work on** Livemark (checks, review, conventions) → a repo skill in `.agents/skills/`.
- How a person contributes (setup, commands, the PR flow) → `CONTRIBUTING.md`.

### What not to do

Do not restate the change in the docs. A doc records what someone editing that line needs in
order not to break something; the story of what changed is what `git log` is for. If the diff
adds no invariant and removes none, the right outcome here is **no documentation change**, and
saying so is a complete answer.
