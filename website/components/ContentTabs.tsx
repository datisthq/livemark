import { Children, isValidElement, useEffect, useState } from "react"

/** Tabbed container component for grouping content tabs with optional sync across groups */
export function ContentTabs(props: {
  sync?: string
  children: React.ReactNode
}) {
  const children = Children.toArray(props.children)
  const titles = children.map(child =>
    isValidElement<{ title: string }>(child) ? child.props.title : "",
  )

  const getInitialIndex = () => {
    if (!props.sync) return 0
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("livemark-tab-" + props.sync)
        : null
    if (!saved) return 0
    const idx = titles.indexOf(saved)
    return idx >= 0 ? idx : 0
  }

  const [active, setActive] = useState(getInitialIndex)

  const handleSelect = (i: number) => {
    setActive(i)
    if (props.sync) {
      localStorage.setItem("livemark-tab-" + props.sync, titles[i]!)
      window.dispatchEvent(
        new CustomEvent("livemark-tab-sync", {
          detail: { sync: props.sync, title: titles[i] },
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
      const idx = titles.indexOf(title)
      if (idx >= 0) setActive(idx)
    }
    window.addEventListener("livemark-tab-sync", handler)
    return () => window.removeEventListener("livemark-tab-sync", handler)
  }, [props.sync, titles])

  return (
    <div className="not-prose my-4 rounded-xl border bg-card">
      <div className="flex border-b">
        {titles.map((title, i) => (
          <button
            key={title}
            type="button"
            onClick={() => handleSelect(i)}
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
