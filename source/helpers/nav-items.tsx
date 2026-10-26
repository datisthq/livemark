import { sites } from "livemark:virtual"
import { Link, useLocation } from "@tanstack/react-router"
import {
  sectionFirstArticle,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import { DynamicIcon } from "./dynamic-icon.tsx"
import { prefixUrl } from "./prefix-url.ts"
import { customSectionActive } from "./section.ts"
import { useMessages, useSite } from "../hooks/site.ts"

export type NavItem = {
  key: string
  title: string
  icon?: string
  suffix?: string
  active: boolean
  href?: string
  target?: string
}

export function useNavItems(activePrefix?: string) {
  const pathname = useLocation({ select: l => l.pathname })
  const site = useSite()
  const t = useMessages()
  const config = site.config
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
    const home = site.language.prefix
    items.push({ key: home, title: t("nav.docs"), active: true, target: home })
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

export function renderNavAnchor(item: NavItem, className?: string) {
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
      <a href={prefixUrl(item.href, sites[0].config.base)} className={className}>
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

function splatFor(pathname: string) {
  return { _splat: pathname.replace(/^\/|\/$/g, "") }
}
