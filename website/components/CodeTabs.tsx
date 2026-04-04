import { Children, useState } from "react"

/** Tabbed code block component for grouping multiple code blocks */
export function CodeTabs(props: { tabs: string; children: React.ReactNode }) {
  const names = JSON.parse(props.tabs) as string[]
  const children = Children.toArray(props.children)
  const [active, setActive] = useState(0)

  return (
    <div className="not-prose my-4 rounded-xl border shadow-sm overflow-hidden text-sm bg-sidebar dark:bg-sidebar">
      <div className="flex border-b">
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
              i === active
                ? "text-foreground border-b-2 border-primary -mb-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      {children.map((child, i) => (
        <div
          key={names[i]}
          className={
            i === active
              ? "[&>figure]:my-0 [&>figure]:rounded-none [&>figure]:border-0 [&>figure]:shadow-none"
              : "hidden"
          }
        >
          {child}
        </div>
      ))}
    </div>
  )
}
