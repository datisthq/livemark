import { Link, useLocation } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { ChevronRight, ExternalLink, FileText, icons } from "lucide-react"
import { articleGroups } from "../content/article.ts"
import { articleIcons } from "../helpers/article-icon.ts"
import type { ArticleNode } from "../models/article.ts"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../elements/collapsible.tsx"
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
import { Search } from "./Search.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import { Theme } from "./Theme.tsx"

/** Application sidebar with article navigation, search, and theme toggle */
export function Sidebar() {
  const pathname = useLocation({ select: l => l.pathname })
  const { toggleSidebar } = useSidebar()

  useHotkey("S", toggleSidebar)

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
        {articleGroups.map((group, index) => (
          <SidebarGroup key={group.name ?? `__unnamed-${index}`}>
            {group.name && (
              <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
                {group.name}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.nodes.map(node => (
                  <NavNode
                    key={node.pathname}
                    node={node}
                    currentPath={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {import.meta.env.CONFIG.sidebarLinks?.length && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
              Links
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {import.meta.env.CONFIG.sidebarLinks.map(link => {
                  const Icon = link.icon
                    ? icons[
                        link.icon
                          .split("-")
                          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                          .join("") as keyof typeof icons
                      ]
                    : undefined
                  return (
                    <SidebarMenuItem key={link.url}>
                      <SidebarMenuButton
                        className="text-muted-foreground"
                        render={
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        {Icon && <Icon className="size-4" />}
                        <span>
                          {link.title}{" "}
                          <ExternalLink
                            className="inline -mt-0.5 opacity-75"
                            style={{ width: 12, height: 12 }}
                          />
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <Search />
        <Theme />
      </SidebarFooter>
      <SidebarRail />
    </SidebarRoot>
  )
}

function splatFor(pathname: string) {
  return { _splat: pathname.replace(/^\/|\/$/g, "") }
}

function isActive(articlePathname: string, currentPath: string) {
  const normalized = `/${currentPath.replace(/^\/|\/$/g, "")}/`
  return articlePathname === normalized
}

function NavNode(props: { node: ArticleNode; currentPath: string }) {
  const { node, currentPath } = props
  const Icon = articleIcons[node.icon] ?? FileText
  const active = isActive(node.pathname, currentPath)

  if (node.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={active}
          className={active ? "" : "opacity-75"}
          render={<Link to="/$" params={splatFor(node.pathname)} />}
        >
          <Icon className="size-4" />
          <span>{node.label ?? node.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={active}
          className={active ? "" : "opacity-75"}
          render={<Link to="/$" params={splatFor(node.pathname)} />}
        >
          <Icon className="size-4" />
          <span>{node.label ?? node.title}</span>
        </SidebarMenuButton>
        <CollapsibleTrigger className="absolute right-1 top-1.5 p-1 rounded-md hover:bg-sidebar-accent">
          <ChevronRight className="size-3.5 transition-transform group-data-[open]/collapsible:rotate-90" />
        </CollapsibleTrigger>
      </SidebarMenuItem>
      <CollapsibleContent>
        <SidebarMenuSub>
          {node.children.map(child => {
            const childIsActive = isActive(child.pathname, currentPath)
            return (
              <SidebarMenuSubItem key={child.pathname}>
                <SidebarMenuSubButton
                  isActive={childIsActive}
                  className={childIsActive ? "" : "opacity-75"}
                  render={<Link to="/$" params={splatFor(child.pathname)} />}
                >
                  <span>{child.label ?? child.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
