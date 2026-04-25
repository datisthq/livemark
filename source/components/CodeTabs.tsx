import { Children, useEffect, useState } from "react"

/** Tabbed code block component for grouping multiple code blocks with optional sync */
export function CodeTabs(props: {
  tabs: string
  sync?: string
  children: React.ReactNode
}) {
  const names = JSON.parse(props.tabs) as string[]
  const children = Children.toArray(props.children)

  const getInitialIndex = () => {
    if (!props.sync) return 0
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("livemark-tab-" + props.sync)
        : null
    if (!saved) return 0
    const idx = names.indexOf(saved)
    return idx >= 0 ? idx : 0
  }

  const [active, setActive] = useState(getInitialIndex)

  const handleSelect = (i: number) => {
    setActive(i)
    if (props.sync) {
      localStorage.setItem("livemark-tab-" + props.sync, names[i]!)
      window.dispatchEvent(
        new CustomEvent("livemark-tab-sync", {
          detail: { sync: props.sync, title: names[i] },
        }),
      )
    }
  }

  useEffect(() => {
    if (!props.sync) return
    const handler = (e: Event) => {
      const { sync, title } = (
        e as CustomEvent<{ sync: string; title: string }>
      ).detail
      if (sync !== props.sync) return
      const idx = names.indexOf(title)
      if (idx >= 0) setActive(idx)
    }
    window.addEventListener("livemark-tab-sync", handler)
    return () => window.removeEventListener("livemark-tab-sync", handler)
  }, [props.sync, names])

  return (
    <div className="not-prose my-4 rounded-xl border shadow-sm overflow-hidden text-sm bg-sidebar dark:bg-sidebar">
      <div className="flex border-b">
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => handleSelect(i)}
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
