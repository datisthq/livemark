import { config } from "livemark:virtual"
import { useNavigate } from "@tanstack/react-router"
import { Menu } from "lucide-react"
import { Button } from "../elements/button.tsx"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import { useNavItems } from "../helpers/nav-items.tsx"
import { prefixUrl } from "../helpers/prefix-url.ts"
import { MenuSheet } from "./MenuSheet.tsx"

/** Phone navigation for a `Header` without a sidebar: the header sections and links */
export function HeaderMenu() {
  const items = useNavItems()
  const navigate = useNavigate()

  return (
    <MenuSheet
      title="Navigation"
      items={items.map(item => ({
        id: item.key,
        label: item.suffix ? `${item.title} (${item.suffix})` : item.title,
        icon: item.icon && <DynamicIcon name={item.icon} className="size-4 shrink-0" />,
        active: item.active,
        onSelect: () => {
          if (item.href) window.location.assign(prefixUrl(item.href, config.base))
          else if (item.target) navigate({ to: item.target })
        },
      }))}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          title="Navigation"
          aria-label="Navigation"
          className="cursor-pointer"
        />
      }
    >
      <Menu />
    </MenuSheet>
  )
}
