import { useLocation } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"
import { currentSection } from "../content/article.ts"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../elements/sidebar.tsx"

/** Shared sidebar links group rendered from config.links with position: "sidebar" */
export function SidebarLinks() {
  const pathname = useLocation({ select: l => l.pathname })
  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const links = import.meta.env.CONFIG.links?.filter(
    link =>
      link.position === "sidebar" &&
      (!link.prefix || link.prefix === section?.prefix),
  )

  if (!links?.length) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        Links
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map(link => (
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
