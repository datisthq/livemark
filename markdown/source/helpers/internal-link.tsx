import type { ReactNode } from "react"

/** A link to a page of the same app, as a plain anchor outside a Livemark site */
export function InternalLink(props: { href: string; children: ReactNode }) {
  return <a href={props.href}>{props.children}</a>
}
