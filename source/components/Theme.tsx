import { Moon, Sun, SunMoon } from "lucide-react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useState } from "react"
import { Button } from "../elements/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../elements/dropdown-menu.tsx"
import type { ThemePref } from "../helpers/theme.ts"
import { getCurrentTheme, getThemePref, setTheme } from "../helpers/theme.ts"

/** Header menu choosing light, dark or system theme; "T" flips light and dark */
export function Theme() {
  // Read as the menu opens: on the server there is no stored preference to read.
  const [current, setCurrent] = useState<ThemePref>("system")

  useHotkey("T", () => setTheme(getCurrentTheme() === "light" ? "dark" : "light"))

  return (
    <DropdownMenu onOpenChange={open => open && setCurrent(getThemePref())}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            title="Change theme"
            aria-label="Change theme"
            className="cursor-pointer text-muted-foreground"
          />
        }
      >
        {/* Swapped on the `.dark` class rather than on state, so the server render
            matches: no hydration mismatch, no wrong-icon flash. */}
        <Sun className="size-4 dark:hidden" />
        <Moon className="hidden size-4 dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={value => {
            setCurrent(value)
            setTheme(value)
          }}
        >
          <DropdownMenuRadioItem value="light" className="cursor-pointer">
            <Sun />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="cursor-pointer">
            <Moon />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="cursor-pointer">
            <SunMoon />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
