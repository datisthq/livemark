# Contributing

Livemark is an open-source project and we'd love your help — whether that's fixing a bug, polishing the docs, or proposing a new feature. This guide walks through everything you need to get a change from your editor into a release.

## Quick start

You'll need [Node.js](https://nodejs.org/) 24+ and [pnpm](https://pnpm.io/) 10+. Then:

```bash
git clone https://github.com/datisthq/livemark.git
cd livemark
pnpm install
pnpm docs:start
```

`pnpm docs:start` boots the dev server against this repo's own `docs/` so you can iterate on Livemark while seeing the result in your browser. Edits to `source/` or `docs/` reload automatically.

## Repository layout

```
livemark/
├── source/             # all package code (compiles into target/)
│   ├── actions/        # build-time orchestration (config, changelog)
│   ├── commands/       # `livemark <cmd>` CLI entrypoints
│   ├── components/     # React components (overridable via .livemark/)
│   ├── elements/       # shadcn-style primitives (overridable)
│   ├── styles/         # base CSS (overridable)
│   ├── helpers/        # internal utilities (private)
│   ├── hooks/          # public React hooks
│   ├── utils/          # public utilities (e.g. cn)
│   ├── plugins/        # remark / rehype / vite plugins
│   ├── routes/         # TanStack Start routes
│   ├── models/         # Zod schemas
│   ├── content/        # content-collections derivations
│   └── vite.config.ts  # the Vite config consumers run against
├── target/             # compiled JS, used by Node CLI
├── docs/               # this site's content
├── blog/               # this site's blog posts
└── livemark.config.ts  # this site's livemark config
```

Both `source/` and `target/` ship in the npm package: Node loads `target/*.js`, while Vite bundles raw TS from `source/*` so the literal `.ts` import extensions resolve.

## Local commands

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `pnpm docs:start` | Run the dev server against this repo's docs |
| `pnpm docs:build` | Production build of the docs site           |
| `pnpm build`      | Compile `source/` → `target/` (`tsgo`)      |
| `pnpm type`       | Type-check (no emit)                        |
| `pnpm lint`       | Format check + lint via Biome               |
| `pnpm format`     | Auto-fix formatting                         |
| `pnpm unit`       | Run unit tests (Vitest)                     |
| `pnpm test`       | Lint + type + unit                          |

A change is ready to push when `pnpm test` is green and `pnpm docs:build` succeeds.

## Code conventions

- **TypeScript**: strict mode is on. Don't use `any`, the `as` cast, or non-null `!` without a clear reason — flag it in the PR.
- **Imports**: use full ESM paths with the `.ts(x)` extension (`from "./foo.ts"`). Tsgo rewrites them to `.js` on emit via `rewriteRelativeImportExtensions`.
- **Comments**: docstrings on exports only. Skip narrative `//` comments inside function bodies — let the names do the work.
- **File layout**: high-level public items at the top, private helpers at the bottom.
- **Tests**: place unit tests in `<module>.unit.ts` next to the code. No "Arrange/Act/Assert" comments — the structure should be obvious.
- **Formatting**: Biome via `pnpm format`. 2-space indent, no semicolons, single quotes.

## Proposing a change

1. **Open an issue first** for anything bigger than a typo or a small bug. It's much easier to align on direction before code.
2. **Branch from `main`** with a short descriptive name (e.g. `fix-mobile-toc`, `feat-yaml-frontmatter`).
3. **Write a focused commit history**. Livemark uses [Conventional Commits](https://www.conventionalcommits.org/) — the prefix drives semantic-release:
   - `fix:` — bug fix → patch release
   - `feat:` — new feature → minor release
   - `fix!:` / `feat!:` or `BREAKING CHANGE:` footer → major release
   - `chore:`, `docs:`, `refactor:`, `test:` — no release
4. **Run `pnpm test` and `pnpm docs:build`** before pushing.
5. **Open a PR** against `main`. Describe the _why_ (link the issue), include screenshots for any UI change, and call out anything reviewers should pay extra attention to.

## Releases

Releases are driven by [semantic-release](https://semantic-release.gitbook.io/) on every push to `main`. Conventional commit messages decide the next version automatically. Maintainers don't need to bump versions manually.

For a local version bump (e.g. preparing a non-semantic-release branch), use `pnpm setversion <new-version>` — it sets the version without creating a git tag.

## Where to find help

- **Bugs and feature requests**: [GitHub Issues](https://github.com/datisthq/livemark/issues)
- **Discussion / ideas**: [GitHub Discussions](https://github.com/datisthq/livemark/discussions)
- **Source**: [github.com/datisthq/livemark](https://github.com/datisthq/livemark)

Thanks for helping make Livemark better.
