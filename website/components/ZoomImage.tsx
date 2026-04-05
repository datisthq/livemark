import type { ComponentProps } from "react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

/** Image component with click-to-zoom and light/dark theme variant support */
export function ZoomImage(props: ComponentProps<"img">) {
  const src = props.src ?? ""

  if (src.endsWith("#light")) {
    return (
      <Zoom>
        <img {...props} src={src.slice(0, -6)} className="dark:hidden" />
      </Zoom>
    )
  }

  if (src.endsWith("#dark")) {
    return (
      <Zoom>
        <img {...props} src={src.slice(0, -5)} className="hidden dark:block" />
      </Zoom>
    )
  }

  return (
    <Zoom>
      <img {...props} />
    </Zoom>
  )
}
