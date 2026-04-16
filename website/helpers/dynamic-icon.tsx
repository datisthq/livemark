import { Suspense, lazy } from "react"

const Resolver = lazy(() => import("./dynamic-icon-resolver.tsx"))

/** Lazily loads and renders a Lucide icon by kebab-case name */
export function DynamicIcon(props: { name: string; className?: string }) {
  return (
    <Suspense>
      <Resolver {...props} />
    </Suspense>
  )
}
