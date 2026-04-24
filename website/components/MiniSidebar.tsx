import { Link } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
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
import { SidebarLinks } from "./SidebarLinks.tsx"
import { SidebarSections } from "./SidebarSections.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import { Theme } from "./Theme.tsx"

/** Minimal sidebar used on pages without an article tree. On desktop the
 * SidebarProvider keeps it off-canvas; on mobile it drives the sheet so
 * users can still reach Sections / Links / Search / Theme. */
export function MiniSidebar() {
  const { toggleSidebar } = useSidebar()
  useHotkey("S", toggleSidebar)

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
