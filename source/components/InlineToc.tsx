import { useTocItems } from "../helpers/toc-context.ts"

/** Renders the page's table of contents inline within the content */
export function InlineToc(props: { maxLevel?: string }) {
  const allItems = useTocItems()
  const maxDepth = props.maxLevel ? Number(props.maxLevel) : 4
  const items = allItems.filter(item => item.depth <= maxDepth)

  if (items.length === 0) return null

  return (
    <nav className="not-prose my-8 rounded-xl border border-border bg-card p-6">
      <p className="text-base font-semibold mb-4">Table of Contents</p>
      <ul className="text-base space-y-2.5">
        {items.map(item => (
          <li
            key={item.url}
            style={{ paddingLeft: `${(item.depth - 2) * 1.25}rem` }}
          >
            <a
              href={item.url}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
