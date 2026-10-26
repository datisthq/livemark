import { ChevronDownIcon } from "lucide-react"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import { prefixUrl } from "../helpers/prefix-url.ts"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../elements/sidebar.tsx"
import type { RoutedSection, Section } from "../models/section.ts"
import { MenuSheet } from "./MenuSheet.tsx"
import { useMessages, useSite } from "../hooks/site.ts"

/** Mobile Sections group: a select-like trigger opening a bottom sheet that swaps the
 * sidebar body to another section without navigating; custom sections still navigate
 * to their URL. */
export function SidebarSectionPicker(props: {
  section: RoutedSection
  onSelect: (section: RoutedSection) => void
}) {
  const config = useSite().config
  const t = useMessages()
  const sections = config.sections ?? []

  const selectSection = (picked: Section) => {
    if (picked.type === "custom") {
      window.location.assign(prefixUrl(picked.url, config.base))
      return
    }
    props.onSelect(picked)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        {t("nav.sections")}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <MenuSheet
          title={t("nav.chooseSection")}
          items={sections.map(s => ({
            id: sectionKey(s),
            label: s.title,
            icon: s.icon ? <DynamicIcon name={s.icon} className="size-4" /> : undefined,
            active: s.type !== "custom" && s.prefix === props.section.prefix,
            onSelect: () => selectSection(s),
          }))}
          trigger={
            <button
              type="button"
              aria-label={t("nav.section")}
              aria-haspopup="dialog"
              className="flex h-9 w-full min-w-0 cursor-pointer items-center gap-2 rounded-control border border-input bg-transparent px-3 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50"
            />
          }
        >
          {props.section.icon && (
            <DynamicIcon name={props.section.icon} className="size-4 shrink-0" />
          )}
          <span className="flex-1 truncate">{props.section.title}</span>
          <ChevronDownIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </MenuSheet>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function sectionKey(section: Section) {
  return section.type === "custom" ? `url:${section.url}` : section.prefix
}
