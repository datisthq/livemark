import { Link, useLocation } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { ChevronRight, FileText } from "lucide-react"
import {
  articleGroups,
  currentSection,
  sectionArticleGroups,
  sectionFirstArticle,
} from "../content/article.ts"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
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
import { SidebarLinks } from "./SidebarLinks.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import { Theme } from "./Theme.tsx"

/** Application sidebar with article navigation, search, and theme toggle */
export function Sidebar() {
  const pathname = useLocation({ select: l => l.pathname })
  const { toggleSidebar } = useSidebar()

  useHotkey("S", toggleSidebar)

  const configSections = import.meta.env.CONFIG.sections
  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const groups = configSections?.length
    ? (sectionArticleGroups.get(section?.prefix ?? "__default__") ??
      articleGroups)
    : articleGroups
  const sidebarSections =
    configSections?.filter(s => s.position === "sidebar") ?? []

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
        {sidebarSections.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
              Sections
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarSections.map(s => {
                  const target = sectionFirstArticle.get(s.prefix) ?? s.prefix
                  const active = section?.prefix === s.prefix
                  return (
                    <SidebarMenuItem key={s.prefix}>
                      <SidebarMenuButton
                        isActive={active}
                        className={active ? "" : "opacity-75"}
                        render={
                          <Link
                            to={target === "/" ? "/" : "/$"}
                            params={
                              target && target !== "/" ? splatFor(target) : {}
                            }
                          />
                        }
                      >
                        {s.icon && (
                          <DynamicIcon name={s.icon} className="size-4" />
                        )}
                        <span>{s.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {groups.map((group, index) => (
          <SidebarGroup key={group.name ?? `__unnamed-${index}`}>
            {group.name && (
              <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
                {group.name}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.nodes.map(node => (
                  <NavNode key={node.path} node={node} currentPath={pathname} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
  const active = isActive(node.path, currentPath)

  if (node.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={active}
          className={active ? "" : "opacity-75"}
          render={<Link to="/$" params={splatFor(node.path)} />}
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
          render={<Link to="/$" params={splatFor(node.path)} />}
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
            const childIsActive = isActive(child.path, currentPath)
            return (
              <SidebarMenuSubItem key={child.path}>
                <SidebarMenuSubButton
                  isActive={childIsActive}
                  className={childIsActive ? "" : "opacity-75"}
                  render={<Link to="/$" params={splatFor(child.path)} />}
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
