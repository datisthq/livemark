import { useTocItems } from "../helpers/toc-context.ts"

/** Renders the page's table of contents inline within the content */
export function InlineToc() {
  const items = useTocItems()

  if (items.length === 0) return null

  return (
    <nav className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium mb-2">On this page</p>
      <ul className="text-sm space-y-1">
        {items.map(item => (
          <li
            key={item.url}
            style={{ paddingLeft: `${(item.depth - 2) * 1}rem` }}
          >
            <a
              href={item.url}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
