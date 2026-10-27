import { Keyboard } from "lucide-react"
import { useState } from "react"
import { Button } from "../elements/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../elements/dropdown-menu.tsx"
import { Kbd } from "../elements/kbd.tsx"
import type { MessageKey } from "../models/message.ts"
import { useMessages } from "../hooks/site.ts"

// A `targeted` key works only while a visible control announces it with
// `aria-keyshortcuts`, like the sidebar toggle or the next-article link
const SHORTCUTS: { key: string; label: MessageKey; targeted?: boolean }[] = [
  { key: "S", label: "shortcuts.search", targeted: true },
  { key: "T", label: "shortcuts.theme", targeted: true },
  { key: "M", label: "shortcuts.sidebar", targeted: true },
  { key: "J", label: "shortcuts.scrollDown" },
  { key: "K", label: "shortcuts.scrollUp" },
  { key: "U", label: "shortcuts.top" },
  { key: "D", label: "shortcuts.bottom" },
  { key: "L", label: "shortcuts.next", targeted: true },
  { key: "H", label: "shortcuts.previous", targeted: true },
]

/** Header menu listing the keyboard shortcuts this page answers to; a row also runs
 * its shortcut. Hidden on a phone, which has no keyboard to use them */
export function Shortcuts() {
  const t = useMessages()
  const [available, setAvailable] = useState(SHORTCUTS)

  return (
    <DropdownMenu onOpenChange={open => open && setAvailable(listAvailable())}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            title={t("shortcuts.title")}
            aria-label={t("shortcuts.title")}
            className="hidden cursor-pointer text-muted-foreground lg:inline-flex"
          />
        }
      >
        <Keyboard className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("shortcuts.title")}</DropdownMenuLabel>
          {available.map(item => (
            <DropdownMenuItem
              key={item.key}
              onClick={() => pressKey(item.key)}
              className="cursor-pointer gap-2"
            >
              <span className="flex-1">{t(item.label)}</span>
              <Kbd>{item.key}</Kbd>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function listAvailable() {
  return SHORTCUTS.filter(
    item =>
      !item.targeted ||
      [...document.querySelectorAll(`[aria-keyshortcuts="${item.key}"]`)].some(el =>
        el.checkVisibility(),
      ),
  )
}

function pressKey(key: string) {
  const init = { key: key.toLowerCase(), code: `Key${key}`, bubbles: true }
  document.body.dispatchEvent(new KeyboardEvent("keydown", init))
}
