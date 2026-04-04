import { Link, useMatches } from "@tanstack/react-router"
import { allArticles } from "content-collections"
import { BookOpen, FileText } from "lucide-react"
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumbs />
        </header>
        <main className="flex-1">{props.children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar() {
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
                <span className="text-xs">Documentation</span>
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
              {allArticles.map(article => (
                <SidebarMenuItem key={article._meta.path}>
                  <SidebarMenuButton
                    render={
                      <Link to="/$path" params={{ path: article._meta.path }} />
                    }
                  >
                    <FileText className="size-4" />
                    <span>{article.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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

function Breadcrumbs() {
  const matches = useMatches()
  const last = matches[matches.length - 1]
  const loaderData = last?.loaderData as { title?: string } | undefined

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground transition-colors">
        Docs
      </Link>
      {loaderData?.title && (
        <>
          <span>/</span>
          <span className="text-foreground font-medium">
            {loaderData.title}
          </span>
        </>
      )}
    </nav>
  )
}
