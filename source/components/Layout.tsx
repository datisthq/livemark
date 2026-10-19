import { config } from "livemark:virtual"
import { useLocation, useMatch } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useState } from "react"
import { currentSection } from "../content/article.ts"
import { activeSiteLink } from "../helpers/section.ts"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../elements/sidebar.tsx"
import { BackToTop } from "./BackToTop.tsx"
import { Banner } from "./Banner.tsx"
import { HeaderNav } from "./HeaderNav.tsx"
import { Search } from "./Search.tsx"
import { Sidebar } from "./Sidebar.tsx"
import { SiteLink } from "./SiteLink.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import { Theme } from "./Theme.tsx"

export function Layout(props: { withSidebar?: boolean; children?: React.ReactNode }) {
  const pathname = useLocation({ select: l => l.pathname })
  const articleRoute = useMatch({ from: "/$", shouldThrow: false })
  const activeSection = articleRoute
    ? currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
    : undefined
  const siteLinkTarget = activeSiteLink(pathname, config.sections ?? [])

  useHotkey("J", () =>
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" }),
  )
  useHotkey("K", () =>
    window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" }),
  )

  const [compactSearch, setCompactSearch] = useState(false)

  const header = (
    <header className="sticky top-0 z-20 flex has-[[data-header-search]]:z-40 h-16 shrink-0 items-center border-b bg-background">
      <div
        className={`flex min-w-0 items-center self-stretch pl-4 lg:shrink-0 ${props.withSidebar ? "pr-4" : "lg:w-[calc(var(--sidebar-width)+4rem)]"}`}
      >
        {props.withSidebar ? (
          <>
            <div className="hidden lg:flex">
              <SidebarTrigger />
            </div>
            <SiteLink
              to={siteLinkTarget}
              className="lg:hidden flex min-w-0 items-center gap-2"
            >
              <SiteTitle />
            </SiteLink>
          </>
        ) : (
          <SiteLink to={siteLinkTarget} className="flex min-w-0 items-center gap-2">
            <SiteTitle />
          </SiteLink>
        )}
      </div>
      <HeaderNav
        activePrefix={activeSection?.prefix}
        onCompactChange={setCompactSearch}
      />
      <div className="ml-auto flex shrink-0 items-center gap-1 pr-2 lg:pr-1">
        <Search compact={compactSearch} />
        <Theme />
        <div className="lg:hidden">
          <SidebarTrigger />
        </div>
      </div>
    </header>
  )

  return (
    <>
      <Banner />
      <SidebarProvider
        key={props.withSidebar ? "sidebar" : "mini"}
        defaultOpen={!!props.withSidebar}
      >
        <SidebarShell withSidebar={props.withSidebar} header={header}>
          {props.children}
        </SidebarShell>
      </SidebarProvider>
    </>
  )
}

function SidebarShell(props: {
  withSidebar?: boolean
  header: React.ReactNode
  children?: React.ReactNode
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) return
    if ((event.target as HTMLElement).closest("a")) setOpenMobile(false)
  }
  return (
    <div style={{ display: "contents" }} onClick={onClick}>
      <Sidebar withSidebar={props.withSidebar} />
      <SidebarInset>
        {props.header}
        <main className="flex-1">{props.children}</main>
        <BackToTop />
      </SidebarInset>
    </div>
  )
}
