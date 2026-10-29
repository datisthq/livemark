# Contributing

> [!WARNING]
> **We don't accept pull requests from outside contributors.** Pull requests opened by anyone outside the team are closed without review. If you've found a bug or have an idea, open an issue or start a discussion instead, as described below.

Livemark is an open-source project developed by the [Datist](https://datist.io) team. Everyone is welcome to help shape it with bug reports, ideas and questions; code changes come from team members.

## Contributors

### Report a bug

Open an issue on [GitHub Issues](https://github.com/datisthq/livemark/issues). A good report includes:

- the Livemark version and how you use it
- the smallest input that reproduces the problem
- the output you got and the output you expected

### Share an idea or ask a question

Use [GitHub Discussions](https://github.com/datisthq/livemark/discussions) for anything that isn't a bug:

- [Ideas](https://github.com/datisthq/livemark/discussions/new?category=ideas): features and improvements you'd like to see
- [Q&A](https://github.com/datisthq/livemark/discussions/new?category=q-a): questions about using Livemark
- [Show and tell](https://github.com/datisthq/livemark/discussions/new?category=show-and-tell): projects built with Livemark

Ideas the team picks up turn into issues.

## Members

The rest of this guide is for Datist team members working on Livemark.

### Quick start

You'll need [Node.js](https://nodejs.org/) 24+ and [pnpm](https://pnpm.io/) 11+. Then:

```bash
git clone https://github.com/datisthq/livemark.git
cd livemark
pnpm install
pnpm start
```

`pnpm start` boots the dev server against this repo's own `docs/` so you can iterate on Livemark while seeing the result in your browser. Edits to `source/` or `docs/` reload automatically.

### Repository layout

```
livemark/
├── source/             # all package code (compiles into build/)
│   ├── actions/        # build-time orchestration (config, changelog)
│   ├── commands/       # `livemark <cmd>` CLI entrypoints
│   ├── components/     # React components (overridable via .livemark/)
│   ├── elements/       # shadcn-style primitives (overridable)
│   ├── styles/         # base CSS (overridable)
│   ├── helpers/        # internal utilities (private)
│   ├── hooks/          # public React hooks
│   ├── plugins/        # remark / rehype / vite plugins
│   ├── routes/         # TanStack Start routes
│   ├── models/         # Zod schemas
│   ├── content/        # content-collections derivations
│   └── vite.config.ts  # the Vite config consumers run against
├── build/              # compiled JS, used by Node CLI
├── skills/             # agent skills shipped to people who install Livemark
├── docs/               # this site's content
├── blog/               # this site's blog posts
└── livemark.config.ts  # this site's livemark config
```

Both `source/` and `build/` ship in the npm package: Node loads `build/*.js`, while Vite bundles raw TS from `source/*` so the literal `.ts` import extensions resolve.

### Local commands

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `pnpm start`       | Run the dev server against this repo's docs |
| `pnpm build:docs`  | Production build of the docs site           |
| `pnpm build`       | Compile `source/` → `build/` (`tsgo`)       |
| `pnpm check:types` | Type-check (no emit)                        |
| `pnpm check:lint`  | Format check + lint via vite-plus           |
| `pnpm check`       | Lint + type                                 |
| `pnpm format`      | Auto-fix formatting                         |
| `pnpm test:unit`   | Run unit tests (Vitest)                     |
| `pnpm test`        | Lint + type + unit                          |

A change is ready to push when `pnpm test` is green and `pnpm build:docs` succeeds.

### Code conventions

- **TypeScript**: strict mode is on. Don't use `any`, the `as` cast, or non-null `!` without a clear reason — flag it in the PR.
- **Imports**: use full ESM paths with the `.ts(x)` extension (`from "./foo.ts"`). Tsgo rewrites them to `.js` on emit via `rewriteRelativeImportExtensions`.
- **Comments**: docstrings on exports. A `//` comment must name the mistake it prevents, stays under about three lines, and comments never outnumber code — rationale and history belong in git.
- **File layout**: high-level public items at the top, private helpers at the bottom.
- **Tests**: place unit tests in `<module>.unit.ts` next to the code. No "Arrange/Act/Assert" comments — the structure should be obvious.
- **Formatting**: vite-plus via `pnpm format`. 2-space indent, no semicolons, double quotes, 90 columns.

### Proposing a change

1. **Open an issue first** for anything bigger than a typo or a small bug. It's much easier to align on direction before code.
2. **Branch from `main`** with a short descriptive name (e.g. `fix-mobile-toc`, `feat-yaml-frontmatter`).
3. **Write a focused commit history**. Livemark uses [Conventional Commits](https://www.conventionalcommits.org/) — the prefix drives release-please:
   - `fix:` — bug fix in the published package → patch release
   - `feat:` — new feature in the published package → minor release
   - `chore:`, `docs:`, `refactor:`, `test:` — no release; use these for CI, tooling, dependencies, the docs site and anything else an installer never sees
   - never mark a commit breaking (`!` or a `BREAKING CHANGE:` footer) without a maintainer agreeing to a major release
4. **Run `pnpm test` and `pnpm build:docs`** before pushing.
5. **Open a PR** against `main`. Describe the _why_ (link the issue), include screenshots for any UI change, and call out anything reviewers should pay extra attention to.

### Releases

Releases are driven by [release-please](https://github.com/googleapis/release-please). A `feat` or `fix` landing on `main` opens a Release PR with the computed version and changelog; merging that PR tags, publishes and creates the GitHub release. Maintainers never bump versions by hand — `.release/manifest.json` is maintained by release-please.
