import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import type { TocItem } from "../models/toc.ts"

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

/** Mobile-only sticky secondary bar showing the active heading and an
 * overlay dropdown with the Contents + page Actions. */
export function MobileToc(props: { items: TocItem[]; children?: ReactNode }) {
  const activeId = useActiveHeading(props.items)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  if (props.items.length === 0 && !props.children) return null

  const active = props.items.find(item => item.url.slice(1) === activeId)
  const title = active?.title ?? props.items[0]?.title ?? "Contents"

  return (
    <div
      ref={wrapperRef}
      className="xl:hidden sticky top-16 z-20 border-b bg-background"
    >
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-muted-foreground"
      >
        <ScrollProgressRing />
        <span className="truncate flex-1 text-left">{title}</span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-px max-h-[calc(100vh-8rem)] overflow-auto border-b bg-background shadow-md animate-in slide-in-from-top-2 fade-in-0 duration-200">
          <div className="space-y-4 px-4 pt-4 pb-4">
            {props.children}
            {props.items.length > 0 && (
              <nav>
                <p className="mb-2 text-sm font-medium">Contents</p>
                <ul className="border-l border-border text-sm">
                  {props.items.map(item => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        data-active={
                          activeId === item.url.slice(1) || undefined
                        }
                        onClick={() => setOpen(false)}
                        className={`-ms-px block border-l border-transparent py-1.5 text-muted-foreground transition-colors hover:text-foreground data-[active]:border-primary data-[active]:font-medium data-[active]:text-primary ${item.depth <= 2 ? "ps-3" : item.depth === 3 ? "ps-6" : "ps-8"}`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ScrollProgressRing() {
  const progress = useScrollProgress()
  const radius = 6
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 -rotate-90" aria-hidden>
      <circle
        cx="8"
        cy="8"
        r={radius}
        className="stroke-muted-foreground/30"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="8"
        cy="8"
        r={radius}
        className="stroke-primary transition-[stroke-dashoffset] duration-150"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const next = max > 0 ? window.scrollY / max : 0
      setProgress(Math.min(1, Math.max(0, next)))
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])
  return progress
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
