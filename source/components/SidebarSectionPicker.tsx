import { config } from "livemark:virtual"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import { prefixUrl } from "../helpers/prefix-url.ts"
import { NativeSelect, NativeSelectOption } from "../elements/native-select.tsx"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../elements/sidebar.tsx"
import type { RoutedSection, Section } from "../models/section.ts"

/** Mobile Sections group: a dropdown that swaps the sidebar body to another
 * section without navigating; custom sections still navigate to their URL. */
export function SidebarSectionPicker(props: {
  section: RoutedSection
  onSelect: (section: RoutedSection) => void
}) {
  const sections = config.sections ?? []

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const picked = sections.find(s => sectionKey(s) === event.target.value)
    if (!picked) return
    if (picked.type === "custom") {
      window.location.assign(prefixUrl(picked.url, config.base))
      return
    }
    props.onSelect(picked)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
        Sections
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex items-center gap-2 px-2">
        {props.section.icon && (
          <DynamicIcon name={props.section.icon} className="size-4 shrink-0" />
        )}
        <NativeSelect
          aria-label="Section"
          className="w-full"
          value={props.section.prefix}
          onChange={onChange}
        >
          {sections.map(s => (
            <NativeSelectOption key={sectionKey(s)} value={sectionKey(s)}>
              {s.title}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function sectionKey(section: Section) {
  return section.type === "custom" ? `url:${section.url}` : section.prefix
}
