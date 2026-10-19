import { useHotkey } from "@tanstack/react-hotkeys"

/** Headless wrapper around every route; pages add their own chrome with `Layout` */
export function Root(props: { children?: React.ReactNode }) {
  useHotkey("J", () =>
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" }),
  )
  useHotkey("K", () =>
    window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" }),
  )

  return props.children
}
