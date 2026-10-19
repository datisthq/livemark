import { config } from "livemark:virtual"
import { useLocation, useMatch } from "@tanstack/react-router"
import { useState } from "react"
import { cn } from "cn"
import { currentSection } from "../content/article.ts"
import { activeSiteLink } from "../helpers/section.ts"
import { HeaderMenu } from "./HeaderMenu.tsx"
import { HeaderNav } from "./HeaderNav.tsx"
import { Search } from "./Search.tsx"
import { SiteLink } from "./SiteLink.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import { Theme } from "./Theme.tsx"

/** Sticky site header: title, header sections and links, search and theme. `toggle`
 * sits before the title from `lg`; `menu` opens the phone navigation */
export function Header(props: { toggle?: React.ReactNode; menu?: React.ReactNode }) {
  const pathname = useLocation({ select: l => l.pathname })
  const articleRoute = useMatch({ from: "/$", shouldThrow: false })
  const activeSection = articleRoute
    ? currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
    : undefined
  const siteLinkTarget = activeSiteLink(pathname, config.sections ?? [])
  const [compactSearch, setCompactSearch] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex has-[[data-header-search]]:z-40 h-16 shrink-0 items-center border-b bg-background">
      <div
        className={cn(
          "flex min-w-0 items-center self-stretch pl-4 lg:shrink-0",
          props.toggle ? "pr-4" : "lg:w-[calc(var(--sidebar-width,16rem)+4rem)]",
        )}
      >
        {props.toggle && <div className="hidden lg:flex">{props.toggle}</div>}
        <SiteLink
          to={siteLinkTarget}
          className={cn("flex min-w-0 items-center gap-2", props.toggle && "lg:hidden")}
        >
          <SiteTitle />
        </SiteLink>
      </div>
      <HeaderNav
        activePrefix={activeSection?.prefix}
        onCompactChange={setCompactSearch}
      />
      <div className="ml-auto flex shrink-0 items-center gap-1 pr-2 lg:pr-1">
        <Search compact={compactSearch} />
        <Theme />
        <div className="lg:hidden">{props.menu ?? <HeaderMenu />}</div>
      </div>
    </header>
  )
}
