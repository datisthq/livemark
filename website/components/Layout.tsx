import { Link, useMatchRoute } from "@tanstack/react-router"
import { allArticles } from "content-collections"
import { BookOpen, ExternalLink, FileText } from "lucide-react"
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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <BookOpen className="size-4" />
              </div>
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
          <SidebarGroupLabel>Articles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allArticles.map(article => {
                const Icon = articleIcons[article.icon] ?? FileText
                const active = !!matchRoute({
                  to: "/$path",
                  params: { path: article._meta.path },
                })
                return (
                  <SidebarMenuItem key={article._meta.path}>
                    <SidebarMenuButton
                      isActive={active}
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
      <SidebarFooter className="p-4">
        <Theme />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
