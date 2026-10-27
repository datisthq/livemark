import { Link, useLocation, useMatch } from "@tanstack/react-router"
import { currentSection, sectionLanding } from "../content/article.ts"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import { prefixUrl } from "../helpers/prefix-url.ts"
import { customSectionActive } from "../helpers/section.ts"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../elements/sidebar.tsx"
import { useMessages, useSite } from "../hooks/site.ts"

function splatFor(pathname: string) {
  return { _splat: pathname.replace(/^\/|\/$/g, "") }
}

/** Shared Sections group. Renders sidebar-positioned sections always, and
 * header-positioned sections only on mobile (mobile collapses all sections
 * into the sidebar since the header nav strip is hidden below `md`). */
export function SidebarSections() {
  const pathname = useLocation({ select: l => l.pathname })
  const articleRoute = useMatch({ from: "/$", shouldThrow: false })
  const section = articleRoute
    ? currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
    : undefined
  const config = useSite().config
  const t = useMessages()
  const sections = config.sections ?? []

  if (!sections.length) return null
  const hasDesktopItems = sections.some(s => s.position === "sidebar")

  return (
    <SidebarGroup className={hasDesktopItems ? undefined : "lg:hidden"}>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        {t("nav.sections")}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sections.map(s => {
            const mobileOnly = s.position !== "sidebar"
            const icon = s.icon
            if (s.type === "custom") {
              const active = customSectionActive(s.url, pathname)
              return (
                <SidebarMenuItem
                  key={s.url}
                  className={mobileOnly ? "lg:hidden" : undefined}
                >
                  <SidebarMenuButton
                    isActive={active}
                    className={active ? "" : "opacity-75"}
                    render={<a href={prefixUrl(s.url, config.base)} />}
                  >
                    {icon && <DynamicIcon name={icon} className="size-4" />}
                    <span>{s.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }
            const target = sectionLanding(s)
            const active = section?.prefix === s.prefix
            return (
              <SidebarMenuItem
                key={s.prefix}
                className={mobileOnly ? "lg:hidden" : undefined}
              >
                <SidebarMenuButton
                  isActive={active}
                  className={active ? "" : "opacity-75"}
                  render={
                    <Link
                      to={target === "/" ? "/" : "/$"}
                      params={target && target !== "/" ? splatFor(target) : {}}
                    />
                  }
                >
                  {icon && <DynamicIcon name={icon} className="size-4" />}
                  <span>{s.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
