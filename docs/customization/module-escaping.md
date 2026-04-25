---
description: Shadow any livemark component, element, or stylesheet by dropping a same-named file into .livemark/.
icon: file-pen-line
order: 8
path: /customization/module-escaping/
---

# Module Escaping

Livemark ships a library of React components, shadcn-style primitives, and a base stylesheet. Each file can be overridden by placing a same-named file under `.livemark/`:

| To override                     | Drop a file at                    |
| ------------------------------- | --------------------------------- |
| `website/components/<Name>.tsx` | `.livemark/components/<Name>.tsx` |
| `website/elements/<name>.tsx`   | `.livemark/elements/<name>.tsx`   |
| `website/styles/<name>.css`     | `.livemark/styles/<name>.css`     |

No import changes are needed. The rest of Livemark picks up the overridden file automatically.

## The `livemark escape` command

Finding and copying a default file to override is automated:

```bash
# List every overridable file:
livemark escape

# Copy a specific default into .livemark/:
livemark escape components/Footer.tsx
```

`livemark escape` refuses to overwrite an existing file. Delete the override first if you want to start over.

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
import { cn } from "livemark/helpers/style"
import { Button } from "livemark/elements/button"
```

Those paths resolve at build time and go through the same override lookup — if you've also overridden `button`, your override wins there too.

## What you can't override this way

- **Custom routes** — use [`.livemark/routes/`](/customization/custom-routes/) instead.
- **Server code** (`actions/`, `commands/`) — not overridable; fork the repo if you need to change these.
- **Config schema** — shape of `livemark.config.ts` is fixed.

## See also

- [Syntax Themes](/customization/syntax-themes/) — the lighter-weight knob if you only want to recolour code.
- [Custom Routes](/customization/custom-routes/) — authoring new pages (rather than replacing existing ones).
