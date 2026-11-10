import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

/** A link to a page of the site, navigated by the site's router */
export function InternalLink(props: { href: string; children: ReactNode }) {
  return <Link to={props.href}>{props.children}</Link>
}
