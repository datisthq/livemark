import { Link } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { ExternalLink, icons } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../elements/sidebar.tsx"
import { Banner } from "./Banner.tsx"
import { Sidebar } from "./Sidebar.tsx"
import { SiteTitle } from "./SiteTitle.tsx"

export function Layout(props: {
  withSidebar?: boolean
  children?: React.ReactNode
}) {
  useHotkey("J", () =>
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" }),
  )
  useHotkey("K", () =>
    window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" }),
  )

  const header = (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center bg-background">
      <div
        className={`flex items-center self-stretch pl-4 border-b ${props.withSidebar ? "pr-0" : "md:pr-20"}`}
      >
        {props.withSidebar ? (
          <SidebarTrigger />
        ) : (
          <Link to="/" className="flex items-center gap-2 px-2">
            <SiteTitle />
          </Link>
        )}
      </div>
      <div className="flex flex-1 items-center gap-8 self-stretch border-b px-6 text-sm">
        <Link
          to="/"
          className="text-foreground font-medium underline underline-offset-4"
        >
          Docs
        </Link>
        {import.meta.env.CONFIG.headerLinks?.map(link => {
          const Icon = link.icon
            ? icons[
                link.icon
                  .split("-")
                  .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                  .join("") as keyof typeof icons
              ]
            : undefined
          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {Icon && <Icon className="inline size-3.5 align-[-0.125em]" />}{" "}
              {link.title}{" "}
              <ExternalLink className="inline size-3 align-[-0.125em]" />
            </a>
          )
        })}
        <Banner />
      </div>
    </header>
  )

  if (!props.withSidebar) {
    return (
      <div className="flex min-h-screen flex-col">
        {header}
        <main className="flex-1">{props.children}</main>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        {header}
        <main className="flex-1">{props.children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
