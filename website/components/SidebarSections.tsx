import { Link, useLocation } from "@tanstack/react-router"
import { currentSection, sectionFirstArticle } from "../content/article.ts"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import { sectionIcon } from "../helpers/section.ts"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../elements/sidebar.tsx"

function splatFor(pathname: string) {
  return { _splat: pathname.replace(/^\/|\/$/g, "") }
}

/** Shared Sections group rendered from config.sections with position: "sidebar" */
export function SidebarSections() {
  const pathname = useLocation({ select: l => l.pathname })
  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const sections =
    import.meta.env.CONFIG.sections?.filter(s => s.position === "sidebar") ?? []

  if (!sections.length) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        Sections
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sections.map(s => {
            const target =
              s.type === "blog" || s.type === "changelog"
                ? s.prefix
                : (sectionFirstArticle.get(s.prefix) ?? s.prefix)
            const active = section?.prefix === s.prefix
            return (
              <SidebarMenuItem key={s.prefix}>
                <SidebarMenuButton
                  isActive={active}
                  className={active ? "" : "opacity-75"}
                  render={
                    <Link
                      to={target === "/" ? "/" : "/$"}
                      params={target && target !== "/" ? splatFor(target) : {}}
                    />
                  }
                >
                  <DynamicIcon name={sectionIcon(s)} className="size-4" />
                  <span>{s.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
