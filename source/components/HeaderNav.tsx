import { ChevronDown } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "cn"
import { type NavItem, renderNavAnchor, useNavItems } from "../helpers/nav-items.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../elements/dropdown-menu.tsx"
import { useMessages } from "../hooks/site.ts"

// The `lg:w-56` Search field minus its 36px icon-only form
const SEARCH_COMPACT_SAVING = 188

/** Header sections and links from `lg`: once they outgrow the bar, Search turns
 * compact and the rest fold into a "More" menu */
export function HeaderNav(props: {
  activePrefix?: string
  onCompactChange: (compact: boolean) => void
}) {
  const items = useNavItems(props.activePrefix)
  const strip = useRef<HTMLElement>(null)
  const measure = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(items.length)
  const onCompactChange = useRef(props.onCompactChange)
  onCompactChange.current = props.onCompactChange

  useLayoutEffect(() => {
    let compact = false
    const fit = () => {
      if (!strip.current || !measure.current) return
      const style = getComputedStyle(strip.current)
      const width =
        strip.current.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight)
      if (width <= 0) return
      // Measured as if Search were full, so toggling it never feeds back into the fit
      const room = width - (compact ? SEARCH_COMPACT_SAVING : 0)
      const gap = parseFloat(getComputedStyle(measure.current).columnGap) || 0
      const widths = [...measure.current.children].map(
        child => child.getBoundingClientRect().width,
      )
      const more = widths.pop() ?? 0
      const total = widths.reduce((sum, w) => sum + w, 0) + gap * (widths.length - 1)

      compact = total > room
      let count = widths.length
      if (total > room + SEARCH_COMPACT_SAVING) {
        let used = more
        count = 0
        for (const w of widths) {
          if (used + gap + w > room + SEARCH_COMPACT_SAVING) break
          used += gap + w
          count++
        }
      }
      onCompactChange.current(compact)
      setVisibleCount(count)
    }
    fit()
    const observer = new ResizeObserver(fit)
    if (strip.current) observer.observe(strip.current)
    if (measure.current) observer.observe(measure.current)
    return () => observer.disconnect()
  }, [])

  const shown = items.slice(0, visibleCount)
  const folded = items.slice(visibleCount)

  return (
    <nav
      ref={strip}
      className="relative hidden w-0 min-w-0 flex-1 items-center gap-6 self-stretch overflow-hidden px-6 text-sm lg:flex xl:gap-8"
    >
      {shown.map(item => (
        <HeaderNavLink key={item.key} item={item} />
      ))}
      {folded.length > 0 && <HeaderNavMore items={folded} />}
      <div
        ref={measure}
        aria-hidden
        inert
        className="invisible absolute left-0 flex gap-6 whitespace-nowrap xl:gap-8"
      >
        {items.map(item => (
          <HeaderNavLink key={item.key} item={item} />
        ))}
        <HeaderNavMoreTrigger active={false} />
      </div>
    </nav>
  )
}

function HeaderNavLink(props: { item: NavItem }) {
  return renderNavAnchor(
    props.item,
    cn(
      "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-foreground",
      props.item.active ? ACTIVE : IDLE,
    ),
  )
}

function HeaderNavMore(props: { items: NavItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<HeaderNavMoreTrigger active={props.items.some(item => item.active)} />}
      />
      <DropdownMenuContent align="end" className="w-auto">
        {props.items.map(item => (
          <DropdownMenuItem
            key={item.key}
            className={cn("cursor-pointer", item.active && "font-medium")}
            render={renderNavAnchor(item)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderNavMoreTrigger(
  props: React.ComponentProps<"button"> & { active: boolean },
) {
  const { active, className, ...rest } = props
  const t = useMessages()
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap text-foreground",
        active ? ACTIVE : IDLE,
        className,
      )}
    >
      {t("nav.more")}
      <ChevronDown className="size-3.5" />
    </button>
  )
}

const ACTIVE = "font-medium border-b-2 border-foreground pb-0.5 -mb-0.5"
const IDLE = "opacity-80 hover:opacity-100 transition-opacity"
