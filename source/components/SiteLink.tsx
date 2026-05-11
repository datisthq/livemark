import { config } from "livemark:virtual"
import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { prefixUrl } from "../helpers/prefix-url.ts"

/** Wrapper for the SiteTitle's link target. Picks `<Link>` for internal
 *  paths (rooted at `/`) and a plain `<a>` for absolute URLs (`http(s)`,
 *  protocol-relative, `mailto:`). Designed to be used both directly
 *  (`<SiteLink to={...}>...</SiteLink>`) and as the `render` element of
 *  a `SidebarMenuButton`, which means props (`className`, children) are
 *  forwarded onto the underlying anchor or Link. */
export function SiteLink(props: {
  to: string
  className?: string
  children?: ReactNode
}) {
  if (isAbsolute(props.to)) {
    return (
      <a href={prefixUrl(props.to, config.base)} className={props.className}>
        {props.children}
      </a>
    )
  }
  if (props.to === "/") {
    return (
      <Link to="/" className={props.className}>
        {props.children}
      </Link>
    )
  }
  const splat = props.to.replace(/^\/|\/$/g, "")
  return (
    <Link to="/$" params={{ _splat: splat }} className={props.className}>
      {props.children}
    </Link>
  )
}

function isAbsolute(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//") ||
    url.startsWith("mailto:")
  )
}
