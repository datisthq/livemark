import { Link, useLocation } from "@tanstack/react-router"
import {
  ChevronRight,
  ExternalLink,
  FileText,
  Search as SearchIcon,
} from "lucide-react"
import { articleTree } from "../helpers/articles.ts"
import { articleIcons } from "../helpers/article-icon.ts"
import type { ArticleNode } from "../models/article.ts"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../elements/collapsible.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../elements/sidebar.tsx"
import { Theme } from "./Theme.tsx"

export function Layout(props: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center bg-background">
          <div className="flex items-center self-stretch pl-4 pr-0 border-b">
            <SidebarTrigger />
          </div>
          <div className="flex flex-1 items-center gap-8 self-stretch border-b px-6 text-sm">
            <Link
              to="/"
              className="text-foreground font-medium underline underline-offset-4"
            >
              Docs
            </Link>
            <a
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </a>
            <a
              href="https://github.com/datisthq/livemark"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub <ExternalLink className="inline size-3 -mt-0.5" />
            </a>
          </div>
        </header>
        <main className="flex-1">{props.children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar() {
  const pathname = useLocation({ select: l => l.pathname })
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <img
                src="/logo.svg"
                alt="Livemark"
                className="size-8 rounded-lg"
              />
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Livemark</span>
                <span className="text-xs">Markdown site generator</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
            Articles
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {articleTree.map(node => (
                <NavNode
                  key={node.pathname}
                  node={node}
                  currentPath={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <Search />
        <Theme />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
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
          <span>{node.title}</span>
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
          <span>{node.title}</span>
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
                  <span>{child.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function Search() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-xl border border-border bg-sidebar-accent/70 px-3 py-2 text-sm text-muted-foreground shadow-xs hover:bg-background transition-colors cursor-pointer"
    >
      <SearchIcon className="size-4" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
        /
      </kbd>
    </button>
  )
}
