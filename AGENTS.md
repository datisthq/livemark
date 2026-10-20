# livemark

TypeScript package and CLI that turns a folder of Markdown into a static documentation site, built on TanStack Start, Vite and content-collections. This repo also hosts Livemark's own docs site, built with Livemark.

## Terminology

- **package** — what `npm install livemark` gets: `build/`, `source/` and `skills/`
- **project** — a consumer's site that uses the package, configured by its `livemark.config.ts`
- **docs site** — this repo's own `docs/` and `blog/`, built by `pnpm build:docs` and deployed to livemark.dev
- **component** — Livemark UI in `source/components/` (PascalCase files)
- **element** — a shadcn-style primitive in `source/elements/` (kebab-case files)
- **escape** — a project shadowing a package file by putting a same-named file under `.livemark/`

## Rules

- **Never commit unless asked to** — except that a session working directly on `main` commits each task once done. The root's index is shared, so always commit with a pathspec: `git commit -m "…" -- <your paths>` — `git add` new files first, since a pathspec commit silently skips untracked ones.
- **Never add co-authored by Claude Code to commits!**
- **Never mark a commit breaking** — no `!` and no `BREAKING CHANGE:` footer; release-please turns either into a major bump.
- **Never push main or pull requests to origin unless asked to.**
- **Never amend or rewrite existing commits unless asked** (`--amend`, `reset`, `rebase`, force-squash). Fold changes in with a follow-up commit.
- **Never change code unless asked to.** Usually just answer.
- When resolving a TODO, follow its instructions literally. Prefer LSP capabilities where available.
- Start a plan from a summary of the new or changed API (models and signatures) and the hardest points.
- **Every plan ends by asking how to work it** (`AskUserQuestion`, before finalising): **the current branch** or **a `.worktrees/<name>` branch** (**`worktree-workflow`**).
- **The escape contract is public API.** `ESCAPABLE_FOLDERS` and `ESCAPABLE_FILES` in `source/settings.ts` name what a project may shadow under `.livemark/`; renaming or moving a file there silently drops a project's override. Treat it like an export change (**`change-review`**).
- Use full relative import paths with the `.ts` / `.tsx` extension. No barrel re-export files — `source/index.ts` is the one public façade.
- Each `actions/<entity>/<verb>.ts` holds one action, named after its verb (`actions/config/load.ts` exports `loadConfig`); a new action gets its own file.
- Don't destructure props in the function signature — use `props.x`. Put higher-level items above the ones they compose, public before private.
- **Comments must not outnumber code**, and one is at most ~3 lines. The bar is: **name the specific mistake this prevents** — if you cannot, delete it. A file with none is normal. Rationale and history belong in git; only a non-obvious invariant (an ordering types cannot express, a failure that looks like success, a deliberate deviation from a rule here) earns lines.
- Typedoc comments only on public API — a brief line on what an exported function or model does; none on files and no `@param`.
- Update docs when a change requires it, and **after every task check whether a skill needs the lesson it taught** — update it in the same commit, or add one when no skill covers the area. Where a fact belongs: the **`human-documentation`** skill.
- **End every response that finishes a task with a status line: one bold sentence of about ten words, as the final paragraph, nothing after it** (e.g. **Ready to commit; lint, types and units green.**).

## Skills

Depth lives in skills: this file carries invariants, the skills carry procedure. Reach for one before working in its area. **A repo skill beats a plugin skill on the same subject** — `change-verification` over verification-before-completion, `change-review` over a generic code review. Each is named `<subject>-<facet>`, subject first.

Repo skills live in `.agents/skills/` (reached by Claude Code through the `.claude/skills` symlink `pnpm install` creates) and are never published:

| skill                 | when                                                                    |
| --------------------- | ----------------------------------------------------------------------- |
| `change-review`       | reviewing a pull request or the working diff — also what CI review runs |
| `change-verification` | checking a change works — the smallest lint/type/unit slice and a look  |
| `human-documentation` | the docs-truth pass before a commit, and where a fact belongs           |
| `issue-resolution`    | taking one issue or bug report to one tested commit in a worktree       |
| `worktree-workflow`   | starting, running and landing a `.worktrees/<name>` branch              |

Shipped skills live in `skills/` and are published in the package for people who install Livemark. Read the matching one before changing the behaviour it describes, and update it in the same commit:

| skill                    | when                                                      |
| ------------------------ | --------------------------------------------------------- |
| `livemark-authoring`     | adding or editing Markdown articles in a Livemark project |
| `livemark-configuration` | changing a Livemark project's configuration               |
| `livemark-customization` | theming or otherwise customising a Livemark site          |

**There is exactly one `AGENTS.md`, at the root.** `scripts/-test/docs.unit.ts` enforces that, along with every path and `pnpm` command these documents name and the two tables above.

## Commands

- `pnpm install` — dependencies, lefthook and the `.claude/skills` symlink
- `pnpm start` — the dev server over this repo's docs site · `pnpm build:docs` — its production build into `.livemark/build/`
- `pnpm build` — compile `source/` into `build/` with `tsgo`
- `pnpm test` — full gate: lint + type + unit · `pnpm check` — lint + type
- `pnpm check:lint` — `vp fmt --check && vp lint` · `pnpm format` — `vp fmt` · `pnpm check:types` — `tsgo --noEmit`
- `pnpm test:unit` — `vp test`. Single test: `vp test path/to/file.unit.ts` or `vp test -t "name"`. While iterating, verify the slice the diff reaches, not the full gate (**`change-verification`**)
- `pnpm measure:coverage` — the unit tests with coverage, which `vp test` leaves off
- `pnpm scan:leaks` / `pnpm scan:vulns` / `pnpm scan` — gitleaks / semgrep / both
- `pnpm update:deps` — bump dependencies past a 7-day cooldown
- `pnpm release` — publish to npm; run by the release workflow only
- `pnpm squash <branch> -m "<subject>"` — land a worktree branch on local `main` as one commit (**`worktree-workflow`**)

## Code structure

Everything the package runs is under `source/`; Node loads `build/*.js`, while Vite bundles the raw TypeScript from `source/` in a project.

- `actions/<entity>/<verb>.ts` — build-time **operations** (load and define config, build the changelog, prepare the target)
- `commands/<command>.ts` — one per `livemark <command>`, wired in `program.ts` and started from `entrypoints/main.ts`
- `components/` — Livemark UI, escapable · `elements/` — shadcn-style primitives, escapable · `styles/` — base CSS, escapable
- `routes/` — TanStack Start routes, escapable · `plugins/` — remark, rehype, shiki and Vite plugins
- `models/<entity>.ts` — zod schemas plus derived types · `content/` — content-collections derivations
- `helpers/<name>.ts` — internal utilities · `utils/` and `hooks/` — utilities and React hooks exposed through `exports`
- Root files are single-concern: `settings.ts`, `program.ts`, `client.tsx`, `server.ts`, `router.tsx`, `head.ts`, `content-collections.ts`, `vite.config.ts`, `index.ts`. `routeTree.gen.ts` is generated
- Unit tests sit beside their module as `<module>.unit.ts`; snapshots land in a sibling `fixtures/generated/`

Non-package code: `scripts/` repo tooling and repo-wide guards, and the dot-directories `.agents/` repo skills, `.livemark/` the docs site's own escapes, `.release/` release-please config.

## Conventions

- pnpm `^11`, Node `^24`, ES Modules; vite-plus format and lint (2-space, LF, UTF-8, no semicolons, 90 columns)
- Strict TypeScript with null checks; no explicit return types. Never use `any`, an `as` cast or `!` without permission
- PascalCase types, interfaces and components; camelCase values. Function names are **verbNoun** (`resolveAssetPath`), never a bare verb or noun; factories are `create*` / `build*` / `make*`
- `package.json` script names are `verb[:object]` (`check:lint`, `build:docs`), never noun-first; a `verb:x` script is a part or a scoped run of `verb`
- Specs: Vitest via `vite-plus/test`, `<module>.unit.ts`, no "Arrange / Act / Assert" comments
- Commits: Conventional Commits, typed by what an installer gets (below)

## Releases

Conventional Commits drive [release-please](https://github.com/googleapis/release-please): a `feat` or `fix` landing on `main` opens a Release PR, and merging that PR cuts the version, tags it and publishes. Merging is the gate — nothing ships without it.

- **IMPORTANT: only changes to the published package use `feat` or `fix`** — `source/`, the `exports` and `files` in `package.json`, and the shipped `skills/`. Everything else MUST be `chore` or `docs`: CI and workflows, release config, dependencies, tooling, `AGENTS.md`, `.agents/skills/`, the README, the docs site
- This is not a style preference. release-please reads the commit type: a `fix:` on a workflow file cuts a release and burns a version number on a change no consumer can observe. Version numbers can never be reused
- When in doubt, ask whether the change alters what someone installing the package gets. If it does not, it is `chore`
- Release config lives in `.release/config.json` and `.release/manifest.json`. The manifest holds the current version and release-please maintains it — never hand-edit it
