# Livemark

Turn a folder of Markdown files into a fast, modern docs site: search, syntax highlighting,
diagrams and math, a blog and a changelog, dark mode and escapable components, built on
TanStack Start and Tailwind.

| Channel | Package                                                          | Install                      |
| ------- | ---------------------------------------------------------------- | ---------------------------- |
| npm     | [`livemark`](https://www.npmjs.com/package/livemark)             | `npm install livemark`       |
| npm     | [`@livemark/vite`](https://www.npmjs.com/package/@livemark/vite) | `npm install @livemark/vite` |

The docs live at [livemark.dev](https://livemark.dev), built with livemark from `livemark/docs/`
and `livemark/blog/`. This repository holds three packages released together: `livemark/`, the CLI and site
with its agent skills; `vite/`, [`@livemark/vite`](https://livemark.dev/customization/markdown-vite-plugin/),
which renders Markdown with Livemark's components in any Vite app; and `markdown/`, the internal
pipeline and components both build on.
See [Contributing](CONTRIBUTING.md) for the layout and the commands.
