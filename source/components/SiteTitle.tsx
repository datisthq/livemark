import { config } from "livemark:virtual"
import { useLocation } from "@tanstack/react-router"
import { prefixUrl } from "../helpers/prefix-url.ts"
import { activeSiteSection } from "../helpers/section.ts"
import defaultLogo from "../assets/logo.svg"

/** Renders the site logo, title, and description in the sidebar header.
 *  When the current pathname falls inside a section that defines its own
 *  `siteTitle` / `siteDescription`, those override the global config. */
export function SiteTitle() {
  const pathname = useLocation({ select: l => l.pathname })
  const section = activeSiteSection(pathname, config.sections ?? [])
  const title = section?.siteTitle ?? config.title
  const description = section?.siteDescription ?? config.description
  const logo = prefixUrl(config.logo ?? defaultLogo, config.base)
  return (
    <div className="flex items-end gap-2.5 text-sm">
      <img src={logo} alt={title} className="size-6.5 mb-1.25" />
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-semibold">{title}</span>
        <span className="text-xs opacity-80">{description}</span>
      </div>
    </div>
  )
}
