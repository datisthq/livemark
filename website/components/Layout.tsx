import { Link } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { ExternalLink } from "lucide-react"
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
        <a
          href="https://github.com/datisthq/livemark"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub <ExternalLink className="inline size-3 -mt-0.5" />
        </a>
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
