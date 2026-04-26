import { config } from "livemark:virtual"
import { Link, useLocation, useMatch } from "@tanstack/react-router"
import { currentSection, sectionFirstArticle } from "../content/article.ts"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import { sectionIcon } from "../helpers/section.ts"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../elements/sidebar.tsx"

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
  const sections = config.sections ?? []

  if (!sections.length) return null
  const hasDesktopItems = sections.some(s => s.position === "sidebar")

  return (
    <SidebarGroup className={hasDesktopItems ? undefined : "md:hidden"}>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        Sections
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sections.map(s => {
            const target =
              s.type === "blog" || s.type === "changelog"
                ? s.prefix
                : (sectionFirstArticle.get(s.prefix) ?? s.prefix)
            const active = section?.prefix === s.prefix
            const mobileOnly = s.position !== "sidebar"
            return (
              <SidebarMenuItem
                key={s.prefix}
                className={mobileOnly ? "md:hidden" : undefined}
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
                  <DynamicIcon name={sectionIcon(s)} className="size-4" />
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
