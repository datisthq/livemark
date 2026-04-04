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
      className="w-full rounded-xl cursor-pointer text-xs font-normal justify-start text-muted-foreground"
    >
      <div className="flex flex-1 gap-2 items-center dark:hidden">
        <Sun className="size-4" />
        <span className="flex-1 text-left">Light Theme</span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          T
        </kbd>
      </div>
      <div className="flex-1 gap-2 items-center hidden dark:flex">
        <Moon className="size-4" />
        <span className="flex-1 text-left">Dark Theme</span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          T
        </kbd>
      </div>
    </Button>
  )
}
