import { Suspense, lazy } from "react"

const MermaidRenderer = lazy(() => import("./MermaidRenderer.tsx"))

/** Lazily loads and renders a Mermaid diagram */
export function Mermaid(props: { children: string }) {
  return (
    <Suspense
      fallback={
        <div className="not-prose mermaid flex justify-center">
          Loading diagram…
        </div>
      }
    >
      <MermaidRenderer>{props.children}</MermaidRenderer>
    </Suspense>
  )
}
