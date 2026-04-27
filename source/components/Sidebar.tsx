import { Link, useLocation, useMatch } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { currentSection } from "../content/article.ts"
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "../elements/sidebar.tsx"
import { Search } from "./Search.tsx"
import { SidebarArticles } from "./SidebarArticles.tsx"
import { SidebarLinks } from "./SidebarLinks.tsx"
import { SidebarPosts } from "./SidebarPosts.tsx"
import { SidebarReleases } from "./SidebarReleases.tsx"
import { SidebarSections } from "./SidebarSections.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import { Theme } from "./Theme.tsx"

/** Application sidebar shell: header, body slot picked by section.type, footer */
export function Sidebar(props: { withSidebar?: boolean }) {
  const pathname = useLocation({ select: l => l.pathname })
  const articleRoute = useMatch({ from: "/$", shouldThrow: false })
  const { toggleSidebar, isMobile } = useSidebar()

  useHotkey("S", () => {
    if (props.withSidebar || isMobile) toggleSidebar()
  })

  const section = articleRoute
    ? currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
    : undefined

  return (
    <SidebarRoot>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <SiteTitle />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSections />
        {props.withSidebar && section?.type === "blog" && <SidebarPosts />}
        {props.withSidebar && section?.type === "changelog" && (
          <SidebarReleases />
        )}
        {props.withSidebar &&
          section?.type !== "blog" &&
          section?.type !== "changelog" && <SidebarArticles />}
        <SidebarLinks />
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <Search />
        <Theme />
      </SidebarFooter>
      <SidebarRail />
    </SidebarRoot>
  )
}
