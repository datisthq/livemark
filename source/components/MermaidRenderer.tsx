import { useEffect, useRef } from "react"
import mermaid from "mermaid"

mermaid.initialize({ startOnLoad: false })

// Module-wide so runs never overlap, even across effect re-runs: overlapping runs on
// one node reject with "reading 'firstChild'".
let renderQueue = Promise.resolve()

/** Renders a Mermaid diagram from a chart definition string */
export default function MermaidRenderer(props: { children: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const render = () => {
      renderQueue = renderQueue
        .then(() => {
          if (!el.isConnected) return
          const isDark = document.documentElement.classList.contains("dark")
          mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? "dark" : "default",
          })
          el.textContent = props.children
          el.removeAttribute("data-processed")
          return mermaid.run({ nodes: [el] })
        })
        .catch(error => {
          if (el.isConnected) console.error(error)
        })
    }

    render()

    const observer = new MutationObserver(render)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [props.children])

  return <div ref={ref} className="not-prose mermaid flex justify-center" />
}
