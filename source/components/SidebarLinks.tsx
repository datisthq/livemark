import { config } from "livemark:virtual"
import { useLocation } from "@tanstack/react-router"
import { currentSection } from "../content/article.ts"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../elements/sidebar.tsx"

/** Shared Links group. Renders sidebar-positioned links always, and
 * header-positioned links only on mobile (mobile collapses all chrome
 * links into the sidebar since the header strip is hidden below `md`). */
export function SidebarLinks() {
  const pathname = useLocation({ select: l => l.pathname })
  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const links =
    config.links?.filter(
      link => !link.prefix || link.prefix === section?.prefix,
    ) ?? []

  if (!links.length) return null
  const hasDesktopItems = links.some(l => l.position === "sidebar")

  return (
    <SidebarGroup className={hasDesktopItems ? undefined : "md:hidden"}>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        Links
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map(link => {
            const mobileOnly = link.position !== "sidebar"
            return (
              <SidebarMenuItem
                key={link.url}
                className={mobileOnly ? "md:hidden" : undefined}
              >
                <SidebarMenuButton
                  className="text-muted-foreground"
                  render={<a href={link.url} />}
                >
                  {link.icon && (
                    <DynamicIcon name={link.icon} className="size-4" />
                  )}
                  <span>{link.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
