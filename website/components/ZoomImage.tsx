import type { ComponentProps } from "react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

/** Image component with click-to-zoom functionality for article content */
export function ZoomImage(props: ComponentProps<"img">) {
  return (
    <Zoom>
      <img {...props} />
    </Zoom>
  )
}
