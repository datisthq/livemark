import { Moon, Sun } from "lucide-react"
import { Button } from "../elements/button.tsx"
import { getCurrentTheme, setTheme } from "../helpers/theme.ts"

export function Theme() {
  const handleToggle = () => {
    const oldTheme = getCurrentTheme()
    const newTheme = oldTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      title="Change Theme"
      aria-label="Toggle color scheme"
      className="w-full rounded-xl cursor-pointer text-xs"
    >
      <div className="flex gap-2 items-center dark:hidden">
        <Sun className="size-4" />
        <span>Light Mode</span>
      </div>
      <div className="gap-2 items-center hidden dark:flex">
        <Moon className="size-4" />
        <span>Dark Mode</span>
      </div>
    </Button>
  )
}
