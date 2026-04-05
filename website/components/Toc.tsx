import { useEffect, useRef, useState, type ReactNode } from "react"
import type { TocItem } from "../helpers/toc.ts"

export function Toc(props: { items: TocItem[]; children?: ReactNode }) {
  const activeId = useActiveHeading(props.items)

  if (props.items.length === 0 && !props.children) return null

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-auto [scrollbar-width:none]">
        {props.children}
        {props.items.length > 0 && (
          <nav>
            <p className="text-sm font-medium mb-3">Contents</p>
            <ul className="text-sm border-l border-border">
              {props.items.map(item => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    data-active={activeId === item.url.slice(1) || undefined}
                    className={`-ms-px block py-1.5 border-l border-transparent text-muted-foreground transition-colors hover:text-foreground data-[active]:border-primary data-[active]:text-primary data-[active]:font-medium ${item.depth <= 2 ? "ps-3" : item.depth === 3 ? "ps-6" : "ps-8"}`}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </aside>
  )
}

function useActiveHeading(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>("")
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const ids = items.map(item => item.url.slice(1))
    const elements = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const visibleSet = new Map<string, number>()

    observer.current = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSet.set(entry.target.id, entry.time)
          } else {
            visibleSet.delete(entry.target.id)
          }
        }

        if (visibleSet.size > 0) {
          let latest = ""
          let latestTime = 0
          for (const [id, time] of visibleSet) {
            if (time > latestTime) {
              latest = id
              latestTime = time
            }
          }
          setActiveId(latest)
        } else {
          const viewTop = window.scrollY
          let closest = ""
          let closestDist = Number.POSITIVE_INFINITY
          for (const el of elements) {
            const dist = Math.abs(
              viewTop - el.getBoundingClientRect().top - window.scrollY,
            )
            if (dist < closestDist) {
              closest = el.id
              closestDist = dist
            }
          }
          setActiveId(closest)
        }
      },
      { threshold: 0.98 },
    )

    for (const el of elements) {
      observer.current.observe(el)
    }

    return () => {
      observer.current?.disconnect()
    }
  }, [items])

  return activeId
}
