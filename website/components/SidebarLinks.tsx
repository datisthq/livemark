import { ExternalLink } from "lucide-react"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../elements/sidebar.tsx"

/** Shared sidebar links group rendered from config.sidebarLinks */
export function SidebarLinks() {
  if (!import.meta.env.CONFIG.sidebarLinks?.length) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        Links
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {import.meta.env.CONFIG.sidebarLinks.map(link => (
            <SidebarMenuItem key={link.url}>
              <SidebarMenuButton
                className="text-muted-foreground"
                render={
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                {link.icon && (
                  <DynamicIcon name={link.icon} className="size-4" />
                )}
                <span>
                  {link.title}{" "}
                  <ExternalLink
                    className="inline -mt-0.5 opacity-75"
                    style={{ width: 12, height: 12 }}
                  />
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
