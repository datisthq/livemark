import { useLocation } from "@tanstack/react-router"
import { prefixUrl } from "../helpers/prefix-url.ts"
import { activeSiteSection } from "../helpers/section.ts"
import defaultLogo from "../assets/logo.svg"
import { useSite } from "../hooks/site.ts"

/** Renders the site logo, title, and description in the sidebar header.
 *  When the current pathname falls inside a section that defines its own
 *  `siteTitle` / `siteDescription`, those override the global config. */
export function SiteTitle() {
  const pathname = useLocation({ select: l => l.pathname })
  const config = useSite().config
  const section = activeSiteSection(pathname, config.sections ?? [])
  const title = section?.siteTitle ?? config.title
  const description = section?.siteDescription ?? config.description
  const logo = prefixUrl(config.logo ?? defaultLogo, config.base)
  return (
    <div className="flex min-w-0 items-end gap-2.5 text-sm">
      <img src={logo} alt={title} className="size-6.5 mb-1 shrink-0" />
      <div className="mb-px flex min-w-0 flex-col leading-none">
        <span className="truncate font-semibold">{title}</span>
        <span className="truncate text-xs opacity-80">{description}</span>
      </div>
    </div>
  )
}
