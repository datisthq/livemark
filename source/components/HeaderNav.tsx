import { config } from "livemark:virtual"
import { Link, useLocation } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "cn"
import {
  sectionFirstArticle,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import { prefixUrl } from "../helpers/prefix-url.ts"
import { customSectionActive } from "../helpers/section.ts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../elements/dropdown-menu.tsx"

// The `lg:w-56` Search field minus its 36px icon-only form
const SEARCH_COMPACT_SAVING = 188

type NavItem = {
  key: string
  title: string
  icon?: string
  suffix?: string
  active: boolean
  href?: string
  target?: string
}

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
      More
      <ChevronDown className="size-3.5" />
    </button>
  )
}

function renderNavAnchor(item: NavItem, className?: string) {
  const children = (
    <>
      {item.icon && <DynamicIcon name={item.icon} className="size-3.5" />}
      <span>
        {item.title}
        {item.suffix && <span className="opacity-80"> ({item.suffix})</span>}
      </span>
    </>
  )
  if (item.href) {
    return (
      <a href={prefixUrl(item.href, config.base)} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link
      to={item.target === "/" ? "/" : "/$"}
      params={item.target && item.target !== "/" ? splatFor(item.target) : {}}
      className={className}
    >
      {children}
    </Link>
  )
}

function useNavItems(activePrefix?: string) {
  const pathname = useLocation({ select: l => l.pathname })
  const sections = config.sections ?? []
  const items: NavItem[] = sections
    .filter(section => section.position === "header")
    .map(section => {
      if (section.type === "custom") {
        return {
          key: section.url,
          title: section.title,
          icon: section.icon,
          active: customSectionActive(section.url, pathname),
          href: section.url,
        }
      }
      const suffix =
        section.type === "changelog" && section.version
          ? sortedArticles.find(
              a => a.path === sectionFlatArticles.get(section.prefix)?.[0],
            )?.title
          : undefined
      return {
        key: section.prefix,
        title: section.title,
        icon: section.icon,
        suffix,
        active: activePrefix === section.prefix,
        target:
          section.type === "blog" || section.type === "changelog"
            ? section.prefix
            : sectionFirstArticle.get(section.prefix),
      }
    })
  if (!sections.length) {
    items.push({ key: "/", title: "Docs", active: true, target: "/" })
  }
  for (const link of config.links ?? []) {
    if (link.position !== "header") continue
    if (link.prefix && link.prefix !== activePrefix) continue
    items.push({
      key: link.url,
      title: link.title,
      icon: link.icon,
      active: false,
      href: link.url,
    })
  }
  return items
}

function splatFor(pathname: string) {
  return { _splat: pathname.replace(/^\/|\/$/g, "") }
}

const ACTIVE = "font-medium border-b-2 border-foreground pb-0.5 -mb-0.5"
const IDLE = "opacity-80 hover:opacity-100 transition-opacity"
