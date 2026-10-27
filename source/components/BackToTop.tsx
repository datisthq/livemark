import { useHotkey } from "@tanstack/react-hotkeys"
import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../elements/button.tsx"
import { useMessages } from "../hooks/site.ts"

/** Floating button that scrolls the page back to the top once the user
 * has scrolled past a threshold. */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const t = useMessages()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useHotkey("U", () => window.scrollTo({ top: 0, behavior: "smooth" }))

  return (
    <Button
      type="button"
      variant="outline"
      aria-label={t("nav.backToTop")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-30 size-10 rounded-full shadow-md transition-all duration-200 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <ArrowUp className="size-4" />
    </Button>
  )
}
