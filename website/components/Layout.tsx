import { Link, useMatchRoute } from "@tanstack/react-router"
import { sortedArticles } from "../helpers/articles.ts"
import { ExternalLink, FileText, Search as SearchIcon } from "lucide-react"
import { articleIcons } from "../helpers/article-icon.ts"
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
  const matchRoute = useMatchRoute()
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
                <span className="text-xs">Site generator</span>
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
              {sortedArticles.map(article => {
                const Icon = articleIcons[article.icon] ?? FileText
                const active = !!matchRoute({
                  to: "/$path",
                  params: { path: article._meta.path },
                })
                return (
                  <SidebarMenuItem key={article._meta.path}>
                    <SidebarMenuButton
                      isActive={active}
                      className={active ? "" : "opacity-75"}
                      render={
                        <Link
                          to="/$path"
                          params={{ path: article._meta.path }}
                        />
                      }
                    >
                      <Icon className="size-4" />
                      <span>{article.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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

function Search() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
    >
      <SearchIcon className="size-4" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
        /
      </kbd>
    </button>
  )
}
