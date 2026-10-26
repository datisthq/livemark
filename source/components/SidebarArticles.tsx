import { sites } from "livemark:virtual"
import { Link, useLocation } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import {
  currentSection,
  languageArticleTrees,
  sectionArticleTrees,
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
import type { RoutedSection } from "../models/section.ts"
import { useMessages, useSite } from "../hooks/site.ts"

/** Article-tree body slot for the Sidebar shell */
export function SidebarArticles(props: { section?: RoutedSection }) {
  const pathname = useLocation({ select: l => l.pathname })

  const site = useSite()
  const t = useMessages()
  const languageTree = languageArticleTrees.get(site.language.code) ?? []
  const section = props.section ?? currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const tree = site.config.sections?.length
    ? (sectionArticleTrees.get(section?.prefix ?? "__default__") ?? languageTree)
    : languageTree

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        {t("nav.articles")}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tree.map(node => (
            <NavNode key={node.path} node={node} currentPath={pathname} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function splatFor(pathname: string) {
  return { _splat: pathname.replace(/^\/|\/$/g, "") }
}

function isActive(articlePathname: string, currentPath: string) {
  const trimmed = currentPath.replace(/^\/|\/$/g, "")
  const normalized = trimmed ? `/${trimmed}/` : "/"
  return articlePathname === normalized
}

function NavNode(props: { node: ArticleNode; currentPath: string; depth?: number }) {
  const { node, currentPath, depth = 0 } = props
  const t = useMessages()
  const Icon = resolveArticleIcon(node.icon)
  const active = isActive(node.path, currentPath)
  const isSub = depth > 0
  const Item = isSub ? SidebarMenuSubItem : SidebarMenuItem
  const Button = isSub ? SidebarMenuSubButton : SidebarMenuButton

  const link = <Link to="/$" params={splatFor(node.path)} />
  const label = (
    <span title={node.untranslated ? t("language.untranslated") : undefined}>
      {node.label ?? node.title}
      {node.untranslated && (
        <span className="ms-1.5 rounded-sm border px-1 font-mono text-[0.6rem] uppercase text-muted-foreground">
          {sites[0].language.code}
        </span>
      )}
    </span>
  )

  if (node.children.length === 0) {
    return (
      <Item>
        <Button isActive={active} className={active ? "" : "opacity-75"} render={link}>
          {!isSub && Icon && <Icon className="size-4" />}
          {label}
        </Button>
      </Item>
    )
  }

  return (
    <Item>
      <Collapsible defaultOpen className="group/collapsible">
        <Button isActive={active} className={active ? "" : "opacity-75"} render={link}>
          {!isSub && Icon && <Icon className="size-4" />}
          {label}
        </Button>
        <CollapsibleTrigger
          aria-label={t("nav.toggleSubmenu", { title: node.label ?? node.title })}
          className="absolute right-1 top-1.5 p-1 rounded-control hover:bg-sidebar-accent"
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
