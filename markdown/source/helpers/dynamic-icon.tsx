import { Suspense, lazy } from "react"

const importResolver = () => import("./dynamic-icon-resolver.tsx")

// Static on the server: a lazy one is still pending on the first page prerendered, which
// then streams its icons as hidden Suspense segments whose throttled reveal holds the
// first paint back by up to 2.3s. The client keeps the lazy chunk.
const Resolver = import.meta.env.SSR
  ? (await importResolver()).default
  : lazy(importResolver)

/** Lazily loads and renders a Lucide icon by kebab-case name */
export function DynamicIcon(props: { name: string; className?: string }) {
  return (
    <Suspense>
      <Resolver {...props} />
    </Suspense>
  )
}
