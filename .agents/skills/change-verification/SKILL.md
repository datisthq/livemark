---
name: change-verification
description: Use when checking a change works before calling it done — the smallest lint/type/unit slice and visual check for the diff, not the full gate. Covers the slice ladder, the docs guard related cannot see, and what the report must say.
---

# Verifying a change

**Verify the diff, not the repo.** `pnpm test` is lint + type + unit over everything, and the
lefthook pre-push hook and CI already run it. While iterating, run the **slice** that could catch
this diff breaking, and say which one ran.

- Never re-run a check that passed if nothing it covers has changed.
- Never chain two heavy commands in one call. One that fails hides the cost of the other.
- Say in the report which slice ran (e.g. "fmt+lint on 3 files, tsgo, Callout tests, Chrome
  light and dark"). Never write "tests pass" for a slice.

## What each check catches

| check                                        | catches                               |
| -------------------------------------------- | ------------------------------------- |
| `vp fmt --check <files>` / `vp lint <files>` | format, oxlint                        |
| `pnpm check:types`                           | types everywhere (one package)        |
| `vp test <file or dir>`                      | the tests named                       |
| `vp test related <files> --run`              | every test importing the files        |
| `pnpm test:unit`                             | every unit test, including the guards |
| `pnpm build:docs`                            | the real build over this repo's docs  |
| `pnpm build`                                 | the `tsgo` emit consumers' Node loads |

All of these run from the repo root. Raw `vitest` fails to collect `vite-plus/test` suites. The
changed files come from `git diff --name-only main...` plus `git status --short`.

## The ladder

Pick the **highest** rung the diff reaches, and run everything that rung lists.

1. **Markdown, copy, CSS.** `vp fmt --check` on the files. For `AGENTS.md`, `README.md`,
   `CONTRIBUTING.md` or a skill in either directory, add `vp test .scripts/-test/docs.unit.ts`:
   it checks every backticked path and `pnpm` command those documents name.
2. **A component, element, style or route.** fmt + lint on the files, `pnpm check:types`, and
   **look at it**: `pnpm start`, then open the page in Claude in Chrome, in light and dark and at
   a phone width. No unit test renders a page, so the look is the real check.
3. **Logic** — an action, helper, model or plugin. Add `vp test related <files> --run`. A new or
   changed test runs on its own first (`vp test <file>`), and fails before the fix.
4. **Build-shaped** — `source/vite.config.ts`, `content-collections.ts`, `program.ts`, a command,
   the escape settings, dependencies, `vite.config.ts`, a `tsconfig`. Run `pnpm test`, then
   `pnpm build:docs`; add `pnpm build` when `tsconfig.build.json` or the `exports` map changed.

## Guards `related` cannot see

`.scripts/-test/docs.unit.ts` reads documents from disk and imports nothing, so
`vp test related` never selects it. Add it by path whenever the diff touches `AGENTS.md`,
`README.md`, `CONTRIBUTING.md`, a skill, a renamed path or a renamed script.

## When the slice is not enough

- **The slice fails somewhere unexpected.** The diff reaches further than you thought. Go up a
  rung; do not narrow the slice until it passes.
- **Generated artefacts.** A route change regenerates `source/routeTree.gen.ts`; slice after
  regenerating, not before.
