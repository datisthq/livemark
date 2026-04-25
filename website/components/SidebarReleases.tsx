import { Link, useLocation } from "@tanstack/react-router"
import { Clock, List } from "lucide-react"
import {
  currentSection,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../elements/sidebar.tsx"

/** Changelog body slot for the Sidebar shell: All Releases / Recent Releases */
export function SidebarReleases() {
  const pathname = useLocation({ select: l => l.pathname })

  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const flat = section ? (sectionFlatArticles.get(section.prefix) ?? []) : []
  const entries = flat
    .map(p => sortedArticles.find(a => a.path === p))
    .filter(a => a !== undefined)
  const recent = entries.slice(0, 5)

  const normalized = `/${pathname.replace(/^\/|\/$/g, "")}/`
  const isIndex = section ? normalized === section.prefix : false
  const sectionPath = (section?.prefix ?? "/changelog/").replace(/^\/|\/$/g, "")

  return (
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
  )
}
