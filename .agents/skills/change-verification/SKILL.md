---
name: change-verification
description: Use when checking a change works before calling it done — the smallest lint/type/unit slice and visual check for the diff, not the full gate. Covers check costs, the slice ladder, the docs guard related cannot see, and the commit gate.
---

# Verifying a change

**Verify the diff, not the repo.** `pnpm test` is lint + type + unit over everything: about
20 s and 40 core-seconds. A CSS fix in a component cannot break the changelog action, so
running every unit test checks nothing. While iterating, run the **slice** that could catch this
diff breaking. The full gate belongs to the lefthook pre-push hook and CI. A local session runs
`pnpm test` only for a build-shaped diff (rung 4); a commit runs the **commit gate** below.

- Never re-run a check that passed if nothing it covers has changed.
- Never chain two heavy commands in one call. One that fails hides the cost of the other.
- Say in the report which slice ran (e.g. "fmt+lint on 3 files, tsgo, Callout tests, Chrome
  light and dark"). Never write "tests pass" for a slice.

## What each check costs

| check                                        | wall  | core-s | catches                               |
| -------------------------------------------- | ----- | ------ | ------------------------------------- |
| `vp fmt --check <files>` / `vp lint <files>` | 1–3 s | ~3     | format, oxlint                        |
| `pnpm check:lint`                            | ~7 s  | ~15    | format and lint everywhere            |
| `pnpm check:types`                           | ~7 s  | ~11    | types everywhere (one package)        |
| `vp test <file or dir>`                      | ~6 s  | ~10    | the tests named                       |
| `vp test related <files> --run`              | ~7 s  | ~8     | every test importing the files        |
| `pnpm test:unit`                             | ~4 s  | ~12    | every unit test, including the guards |
| `pnpm build`                                 | ~4 s  | ~11    | the `tsgo` emit consumers' Node loads |
| `pnpm build:docs`                            | ~13 s | ~24    | the real build over this repo's docs  |

All of these run from the repo root (or the worktree root). Raw `vitest` fails to collect
`vite-plus/test` suites. The changed files come from `git diff --name-only main...` plus
`git status --short`.

## The ladder

Pick the **highest** rung the diff reaches, and run everything that rung lists.

1. **Markdown, copy, CSS.** `vp fmt --check` on the files. For `AGENTS.md`, `README.md`,
   `CONTRIBUTING.md` or a skill in either directory, add `vp test scripts/-test/docs.unit.ts`:
   it checks every backticked path and `pnpm` command those documents name.
2. **A component, element, style or route.** fmt + lint on the files, `pnpm check:types`, and
   **look at it**: `pnpm start`, then open the page in Claude in Chrome, in light and dark and at
   a phone width. No unit test renders the page, so the visual check is the real one. A green
   slice does not show that a callout is the right colour.
3. **Logic** — an action, helper, model or plugin. Add `vp test related <files> --run`. A new or
   changed test runs on its own first (`vp test <file>`), and fails before the fix.
4. **Build-shaped** — `source/vite.config.ts`, `content-collections.ts`, `program.ts`, a command,
   the escape settings, dependencies, `vite.config.ts`, a `tsconfig`. Run `pnpm test`, then
   `pnpm build:docs`; add `pnpm build` when `tsconfig.build.json` or the `exports` map changed.
   No cherry-picking here.

## Guards `related` cannot see

`scripts/-test/docs.unit.ts` reads documents from disk and imports nothing, so
`vp test related` never selects it. Add it by path whenever the diff touches `AGENTS.md`,
`README.md`, `CONTRIBUTING.md`, a skill, a renamed path or a renamed script.

## Worked example

The diff is `source/components/Callout.tsx` and `source/styles/general.css` (warning callouts
recoloured):

```sh
vp fmt --check source/components/Callout.tsx source/styles/general.css
vp lint source/components/Callout.tsx
pnpm check:types
```

Then look at a warning callout in Chrome under `pnpm start`, on both a light and a dark page.
That is about 10 s of checks plus a look, against about 20 s for `pnpm test`, and only the look
can tell whether the colour is right.

## The commit gate

A commit on `main`, and landing a worktree branch (**`worktree-workflow`**), run the **commit
gate** once, at the end: `pnpm check` always, then a unit half **you choose**.

- `pnpm check` = `check:lint` + `check:types`, 5–15 s over the whole package.
- **`pnpm test:unit`** when the diff is build-shaped, changes shared code many modules import
  (`settings.ts`, a model, a helper), or you are unsure.
- **Cherry-pick** otherwise: `vp test related <files> --run` plus every guard above the diff
  triggers.
- Unsure? Run `pnpm test:unit`. Pre-push and CI run everything, but a break they catch has already
  landed on `main` under somebody else's work.
- The report names the path taken: "check + test:unit", or "check + related, docs guard".

## When the slice is not enough

- **The slice fails somewhere unexpected.** The diff reaches further than you thought. Go up a
  rung; do not narrow the slice until it passes.
- **Generated artefacts.** A route change needs `source/routeTree.gen.ts` regenerated; slice
  after regenerating, not before. `pnpm build:docs` writes only `.livemark/.build/routeTree.gen.ts`
  — copy it over, pointing each `./routes/` import of an escaped route at `./../.livemark/routes/`.
- **A change meant to alter no output** — a build speed-up or refactor. Copy
  `.livemark/build/client` aside before it, `pnpm build:docs` after, and diff the HTML with
  `/assets/` hashes masked. The gate stays green when a code block quietly loses highlighting.
