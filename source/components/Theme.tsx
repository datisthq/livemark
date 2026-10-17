import { Moon, Sun } from "lucide-react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Button } from "../elements/button.tsx"
import { getCurrentTheme, setTheme } from "../helpers/theme.ts"

/** Sun/moon header button with "T" keyboard shortcut that flips light and dark themes */
export function Theme() {
  const handleToggle = () => {
    const oldTheme = getCurrentTheme()
    const newTheme = oldTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  useHotkey("T", handleToggle)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      title="Change theme"
      aria-label="Change theme"
      className="cursor-pointer text-muted-foreground"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  )
}
