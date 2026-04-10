import { useEffect, useState, type ComponentProps } from "react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

/** Image component with click-to-zoom and light/dark theme variant support */
export function ZoomImage(props: ComponentProps<"img">) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const src = props.src ?? ""
  let imgProps = props
  if (src.endsWith("#light")) {
    imgProps = { ...props, src: src.slice(0, -6), className: "dark:hidden" }
  } else if (src.endsWith("#dark")) {
    imgProps = {
      ...props,
      src: src.slice(0, -5),
      className: "hidden dark:block",
    }
  }

  const img = <img {...imgProps} alt={imgProps.alt ?? ""} />
  if (!mounted) return img
  return <Zoom>{img}</Zoom>
}
