---
description: Shadow any livemark component, element, or stylesheet by dropping a same-named file into .livemark/.
icon: file-pen-line
order: -1
path: /customization/overriding-escaping/
---

# Overriding/Escaping

Livemark ships a library of React components, shadcn-style primitives, and a base stylesheet. Each file can be overridden by placing a same-named file under `.livemark/`:

| To override                     | Drop a file at                    |
| ------------------------------- | --------------------------------- |
| `website/components/<Name>.tsx` | `.livemark/components/<Name>.tsx` |
| `website/elements/<name>.tsx`   | `.livemark/elements/<name>.tsx`   |
| `website/styles/<name>.css`     | `.livemark/styles/<name>.css`     |
| `website/head.ts`               | `.livemark/head.ts`               |

No import changes are needed. The rest of Livemark picks up the overridden file automatically.

## The `livemark escape` command

Finding and copying a default file to override is automated:

```bash
# Pick files from a searchable list:
livemark escape

# Print every overridable file:
livemark escape --list

# Copy specific defaults into .livemark/:
livemark escape components/Footer.tsx elements/button.tsx
```

In a terminal, `livemark escape` opens a picker: type to filter, <kbd>Tab</kbd> to select, <kbd>Enter</kbd> to copy. Files you already override are shown but can't be picked. Outside a terminal (a pipe, CI) it prints the list, as `--list` does.

`livemark escape` refuses to overwrite an existing file. Delete the override first if you want to start over.

Deleting an override restores the default — at once while the dev server runs, otherwise on the next `start` or `build`.

## Example: custom footer

```bash
livemark escape components/Footer.tsx
```

Then edit `.livemark/components/Footer.tsx`:

```tsx title=".livemark/components/Footer.tsx"
export function Footer() {
  return (
    <p className="mt-12 text-center text-sm text-muted-foreground">
      Built by my team · 2026
    </p>
  )
}
```

Save — the dev server picks it up immediately.

## Example: retheme buttons

```bash
livemark escape elements/button.tsx
```

Edit the `cva` class list in `.livemark/elements/button.tsx` to change button styling globally. Because every Livemark-shipped component imports its `Button` through the override system, your variant applies everywhere.

## Example: tweak a token

```bash
livemark escape styles/general.css
```

Edit the `:root` block in `.livemark/styles/general.css` to rebrand:

```css
:root {
  --primary: oklch(0.55 0.24 27); /* red */
}
```

## Importing other Livemark modules from an override

Inside an override, import other Livemark modules from the `livemark/<subdir>/*` subpath exports:

```tsx title=".livemark/components/Footer.tsx"
import { cn } from "cn"
import { Button } from "livemark/elements/button"
```

Those paths resolve at build time and go through the same override lookup — if you've also overridden `button`, your override wins there too.

### Type checking overrides

Livemark's modules ship as TypeScript source, so your type check covers them too, including the `livemark:virtual` module they read the site config from. Its types load with the `livemark` package: any program that includes `livemark.config.ts` already has them. A program that doesn't adds one line to a `.d.ts` file:

```ts title=".livemark/env.d.ts"
/// <reference types="livemark/env" />
```

Don't declare `livemark:virtual` yourself: a hand-written declaration drifts from the real config type.

## What you can't override this way

- **Custom routes** — use [`.livemark/routes/`](/customization/custom-routes/) instead.
- **Server code** (`actions/`, `commands/`) — not overridable; fork the repo if you need to change these.
- **Config schema** — shape of `livemark.config.ts` is fixed.

## See also

- [Syntax Themes](/customization/syntax-themes/) — the lighter-weight knob if you only want to recolour code.
- [Custom Routes](/customization/custom-routes/) — authoring new pages (rather than replacing existing ones).
