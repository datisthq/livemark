import { Moon, Sun, SunMoon } from "lucide-react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useState } from "react"
import { Button } from "../elements/button.tsx"
import type { ThemePref } from "../helpers/theme.ts"
import { getCurrentTheme, getThemePref, setTheme } from "../helpers/theme.ts"
import { MenuSheet } from "./MenuSheet.tsx"
import { useMessages } from "../hooks/site.ts"

/** Header menu choosing light, dark or system theme; "T" flips light and dark */
export function Theme() {
  // Read as the menu opens: on the server there is no stored preference to read.
  const [current, setCurrent] = useState<ThemePref>("system")
  const t = useMessages()

  useHotkey("T", () => setTheme(getCurrentTheme() === "light" ? "dark" : "light"))

  const choose = (pref: ThemePref) => {
    setCurrent(pref)
    setTheme(pref)
  }

  return (
    <MenuSheet
      title={t("theme.change")}
      onOpenChange={open => open && setCurrent(getThemePref())}
      items={[
        {
          id: "light",
          label: t("theme.light"),
          icon: <Sun className="size-4 shrink-0" />,
          active: current === "light",
          onSelect: () => choose("light"),
        },
        {
          id: "dark",
          label: t("theme.dark"),
          icon: <Moon className="size-4 shrink-0" />,
          active: current === "dark",
          onSelect: () => choose("dark"),
        },
        {
          id: "system",
          label: t("theme.system"),
          icon: <SunMoon className="size-4 shrink-0" />,
          active: current === "system",
          onSelect: () => choose("system"),
        },
      ]}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          title={t("theme.change")}
          aria-label={t("theme.change")}
          aria-keyshortcuts="T"
          className="cursor-pointer text-muted-foreground"
        />
      }
    >
      {/* Swapped on the `.dark` class rather than on state, so the server render
          matches: no hydration mismatch, no wrong-icon flash. */}
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </MenuSheet>
  )
}
