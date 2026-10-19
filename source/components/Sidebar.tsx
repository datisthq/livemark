import { config } from "livemark:virtual"
import { useState } from "react"
import { useLocation, useMatch } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { currentSection } from "../content/article.ts"
import { activeSiteLink } from "../helpers/section.ts"
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "../elements/sidebar.tsx"
import { SidebarArticles } from "./SidebarArticles.tsx"
import { SidebarLinks } from "./SidebarLinks.tsx"
import { SidebarPosts } from "./SidebarPosts.tsx"
import { SidebarReleases } from "./SidebarReleases.tsx"
import { SidebarSectionPicker } from "./SidebarSectionPicker.tsx"
import { SidebarSections } from "./SidebarSections.tsx"
import { SiteLink } from "./SiteLink.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import type { RoutedSection } from "../models/section.ts"

/** Application sidebar shell: header, body slot picked by section.type, footer */
export function Sidebar(props: { withSidebar?: boolean }) {
  const pathname = useLocation({ select: l => l.pathname })
  const articleRoute = useMatch({ from: "/$", shouldThrow: false })
  const { toggleSidebar, isMobile } = useSidebar()

  useHotkey("L", () => {
    if (props.withSidebar || isMobile) toggleSidebar()
  })

  const [browsed, setBrowsed] = useState<{ section: RoutedSection; pathname: string }>()

  const routeSection = articleRoute
    ? currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
    : undefined
  const picking = isMobile && routeSection !== undefined
  // Browsing is scoped to the page it started on, so navigating resets it
  const section =
    picking && browsed?.pathname === pathname ? browsed.section : routeSection
  const siteLinkTarget = activeSiteLink(pathname, config.sections ?? [])

  return (
    <SidebarRoot>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<SiteLink to={siteLinkTarget} />}>
              <SiteTitle />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {picking && section ? (
          <SidebarSectionPicker
            section={section}
            onSelect={picked => setBrowsed({ section: picked, pathname })}
          />
        ) : (
          <SidebarSections />
        )}
        {props.withSidebar && section?.type === "blog" && (
          <SidebarPosts section={section} />
        )}
        {props.withSidebar && section?.type === "changelog" && (
          <SidebarReleases section={section} />
        )}
        {props.withSidebar &&
          section?.type !== "blog" &&
          section?.type !== "changelog" && <SidebarArticles section={section} />}
        <SidebarLinks section={section} />
      </SidebarContent>
      <SidebarRail />
    </SidebarRoot>
  )
}
