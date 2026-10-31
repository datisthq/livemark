import { useHotkey } from "@tanstack/react-hotkeys"
import { useNavigate } from "@tanstack/react-router"
import { usePageNeighbours } from "../helpers/page-neighbours.ts"
import { buildPathLink } from "../helpers/path-link.ts"

/** Headless wrapper around every route; pages add their own chrome with `Layout` */
export function Root(props: { children?: React.ReactNode }) {
  const neighbours = usePageNeighbours()
  const navigate = useNavigate()

  useHotkey("J", () =>
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" }),
  )
  useHotkey("K", () =>
    window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" }),
  )
  useHotkey("D", () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }),
  )
  useHotkey("H", () => neighbours.prev && navigate(buildPathLink(neighbours.prev)))
  useHotkey("L", () => neighbours.next && navigate(buildPathLink(neighbours.next)))

  return props.children
}
