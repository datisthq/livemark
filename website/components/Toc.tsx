import { useEffect, useRef, useState } from "react"
import type { TocItem } from "../helpers/toc.ts"

export function Toc(props: { items: TocItem[] }) {
  const activeId = useActiveHeading(props.items)

  if (props.items.length === 0) return null

  return (
    <nav className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-auto">
        <p className="text-sm font-medium mb-3">On this page</p>
        <ul className="border-l border-border text-sm">
          {props.items.map(item => (
            <li key={item.url}>
              <a
                href={item.url}
                data-active={activeId === item.url.slice(1) || undefined}
                className={`block py-1.5 text-muted-foreground transition-colors hover:text-foreground data-[active]:text-primary data-[active]:font-medium ${item.depth <= 2 ? "ps-3" : item.depth === 3 ? "ps-6" : "ps-8"}`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
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
