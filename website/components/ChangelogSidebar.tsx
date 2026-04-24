import { Link, useLocation } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Clock, List } from "lucide-react"
import {
  currentSection,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "../elements/sidebar.tsx"
import { useCloseSidebarOnNavigate } from "../hooks/close-sidebar-on-navigate.ts"
import { Search } from "./Search.tsx"
import { SidebarLinks } from "./SidebarLinks.tsx"
import { SidebarSections } from "./SidebarSections.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import { Theme } from "./Theme.tsx"

/** Changelog-specific sidebar with Releases and shared Links */
export function ChangelogSidebar() {
  const pathname = useLocation({ select: l => l.pathname })
  const { toggleSidebar } = useSidebar()

  useHotkey("S", toggleSidebar)
  useCloseSidebarOnNavigate()

  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const flat = section ? (sectionFlatArticles.get(section.prefix) ?? []) : []
  const entries = flat
    .map(p => sortedArticles.find(a => a.path === p))
    .filter(a => a !== undefined)
  const recent = entries.slice(0, 10)

  const normalized = `/${pathname.replace(/^\/|\/$/g, "")}/`
  const isIndex = section ? normalized === section.prefix : false
  const sectionPath = (section?.prefix ?? "/changelog/").replace(/^\/|\/$/g, "")

  return (
    <SidebarRoot>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <SiteTitle />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSections />
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
            Releases
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isIndex}
                  className={isIndex ? "" : "opacity-75"}
                  render={<Link to="/$" params={{ _splat: sectionPath }} />}
                >
                  <List className="size-4" />
                  <span>All Releases</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="opacity-75">
                  <Clock className="size-4" />
                  <span>Recent Releases</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {recent.map(entry => {
                    const active = normalized === entry.path
                    return (
                      <SidebarMenuSubItem key={entry.path}>
                        <SidebarMenuSubButton
                          isActive={active}
                          className={active ? "" : "opacity-75"}
                          render={
                            <Link
                              to="/$"
                              params={{
                                _splat: entry.path.replace(/^\/|\/$/g, ""),
                              }}
                            />
                          }
                        >
                          <span>{entry.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarLinks />
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <Search />
        <Theme />
      </SidebarFooter>
      <SidebarRail />
    </SidebarRoot>
  )
}
