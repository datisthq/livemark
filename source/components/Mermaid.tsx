import { Suspense, lazy } from "react"
import { useMessages } from "../hooks/site.ts"

const MermaidRenderer = lazy(() => import("./MermaidRenderer.tsx"))

/** Lazily loads and renders a Mermaid diagram */
export function Mermaid(props: { children: string }) {
  const t = useMessages()
  return (
    <Suspense
      fallback={
        <div className="not-prose mermaid flex justify-center">
          {t("media.loadingDiagram")}
        </div>
      }
    >
      <MermaidRenderer>{props.children}</MermaidRenderer>
    </Suspense>
  )
}
