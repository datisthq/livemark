import { useEffect, useRef } from "react"
import mermaid from "mermaid"

mermaid.initialize({ startOnLoad: false })

/** Renders a Mermaid diagram from a chart definition string */
export default function MermaidRenderer(props: { children: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const render = () => {
      const isDark = document.documentElement.classList.contains("dark")
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
      })
      el.textContent = props.children
      el.removeAttribute("data-processed")
      mermaid.run({ nodes: [el] })
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
