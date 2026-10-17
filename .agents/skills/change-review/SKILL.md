---
name: change-review
description: Review a pull request, or the local branch before it is committed, for correctness, security and repo conventions — inline PR comments, or a ranked list locally. Invoked by the review workflow or a person; never fires on its own.
disable-model-invocation: true
---

# Review a change

Read the diff, judge it, post findings as inline comments. Be useful, not thorough-looking:
a review that flags twenty things teaches nothing, and the twenty-first — the real one — is lost
in it.

## What to look for

**Correctness**

- Logic that is wrong for an input the change makes reachable, not merely unusual.
- Error handling that swallows a failure or reports success on a partial write.
- Concurrency: two builds, a dev-server reload mid-write, a watcher firing twice.
- Performance where the change makes it structurally worse (a re-parse per article, an unbounded
  glob), not where it is merely not optimal.

**Security — OWASP-shaped, but reported only when reachable**

- Injection and XSS: project Markdown, frontmatter or config reaching HTML without passing
  `rehype-sanitize`, or reaching a shell or `eval`.
- Path traversal: an include glob, asset path or escape resolving outside the project root.
- SSRF and unsafe fetches at build time (changelog sources, remote embeds).
- Sensitive data exposure: secrets in code, logs or the built site; insecure cryptography; race
  conditions and TOCTOU.

**This repo's own invariants** — these are where a generic reviewer is blind, and they matter
more than the generic checklist:

- a change to `source/index.ts`, the `exports` map or a public hook, util or model that breaks
  an existing project;
- a renamed or moved file under an escapable folder or an escapable root file
  (`ESCAPABLE_FOLDERS` / `ESCAPABLE_FILES` in `source/settings.ts`), which silently drops a
  project's `.livemark/` override;
- a CLI flag, config field or Markdown directive added or changed with the matching shipped skill
  (`skills/`) and `docs/` page left as they were;
- a commit typed `feat` or `fix` that does not change what an installer gets, or a package change
  typed `chore`;
- a commit marked breaking (`!` or a `BREAKING CHANGE:` footer);
- `AGENTS.md`, a skill or `CONTRIBUTING.md` that the diff made untrue (**`human-documentation`**).

## How to report

Rate each finding **CRITICAL / HIGH / MEDIUM / LOW**, and say what input or sequence produces
the failure. A finding that cannot name the case that breaks is a hunch: either verify it or
leave it out.

Post specific issues as inline comments on the lines they concern. Keep the summary short.
Silence on the parts that are fine is not laziness — it is what makes the flagged parts legible.

If the change is good, say so briefly and stop. Do not manufacture findings to justify the run.

## Reviewing locally

With no pull request — a person running `/change-review` in a checkout — the change is everything
this branch adds over `main`: `git diff main...HEAD` plus the uncommitted and untracked files.
Judge it by the same rules, then print the findings in the terminal, worst first, each with its
`file:line`. Post nothing, and edit nothing unless the caller asks for the fixes.
