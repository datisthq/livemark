import { Children, isValidElement, useState } from "react"

/** Tabbed container component for grouping content tabs */
export function ContentTabs(props: { children: React.ReactNode }) {
  const children = Children.toArray(props.children)
  const titles = children.map(child =>
    isValidElement<{ title: string }>(child) ? child.props.title : "",
  )
  const [active, setActive] = useState(0)

  return (
    <div className="not-prose my-4 rounded-xl border bg-card">
      <div className="flex border-b">
        {titles.map((title, i) => (
          <button
            key={title}
            type="button"
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              i === active
                ? "text-foreground border-b-2 border-primary -mb-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {title}
          </button>
        ))}
      </div>
      {children.map((child, i) => (
        <div
          key={titles[i]}
          className={
            i === active ? "p-4 prose dark:prose-invert max-w-none" : "hidden"
          }
        >
          {child}
        </div>
      ))}
    </div>
  )
}
