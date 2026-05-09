import { config } from "livemark:virtual"
import { Link, useLocation } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import {
  articleGroups,
  currentSection,
  sectionArticleGroups,
} from "../content/article.ts"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../elements/collapsible.tsx"
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
import { resolveArticleIcon } from "../helpers/article-icon.ts"
import type { ArticleNode } from "../models/article.ts"

/** Article-tree body slot for the Sidebar shell */
export function SidebarArticles() {
  const pathname = useLocation({ select: l => l.pathname })

  const configSections = config.sections
  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const groups = configSections?.length
    ? (sectionArticleGroups.get(section?.prefix ?? "__default__") ??
      articleGroups)
    : articleGroups

  return (
    <>
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
    </>
  )
}

function splatFor(pathname: string) {
  return { _splat: pathname.replace(/^\/|\/$/g, "") }
}

function isActive(articlePathname: string, currentPath: string) {
  const normalized = `/${currentPath.replace(/^\/|\/$/g, "")}/`
  return articlePathname === normalized
}

function NavNode(props: {
  node: ArticleNode
  currentPath: string
  depth?: number
}) {
  const { node, currentPath, depth = 0 } = props
  const Icon = resolveArticleIcon(node.icon)
  const active = isActive(node.path, currentPath)
  const isSub = depth > 0
  const Item = isSub ? SidebarMenuSubItem : SidebarMenuItem
  const Button = isSub ? SidebarMenuSubButton : SidebarMenuButton

  const link = <Link to="/$" params={splatFor(node.path)} />
  const label = <span>{node.label ?? node.title}</span>

  if (node.children.length === 0) {
    return (
      <Item>
        <Button
          isActive={active}
          className={active ? "" : "opacity-75"}
          render={link}
        >
          {!isSub && <Icon className="size-4" />}
          {label}
        </Button>
      </Item>
    )
  }

  return (
    <Item>
      <Collapsible defaultOpen className="group/collapsible">
        <Button
          isActive={active}
          className={active ? "" : "opacity-75"}
          render={link}
        >
          {!isSub && <Icon className="size-4" />}
          {label}
        </Button>
        <CollapsibleTrigger
          aria-label={`Toggle ${node.label ?? node.title} submenu`}
          className="absolute right-1 top-1.5 p-1 rounded-md hover:bg-sidebar-accent"
        >
          <ChevronRight className="size-3.5 transition-transform group-data-[open]/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {node.children.map(child => (
              <NavNode
                key={child.path}
                node={child}
                currentPath={currentPath}
                depth={depth + 1}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </Item>
  )
}
