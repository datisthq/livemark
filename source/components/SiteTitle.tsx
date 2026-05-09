import { config } from "livemark:virtual"
import { prefixUrl } from "../helpers/prefix-url.ts"
import defaultLogo from "../assets/logo.svg"

/** Renders the site logo, title, and description in the sidebar header */
export function SiteTitle() {
  const logo = prefixUrl(config.logo ?? defaultLogo, config.base)
  return (
    <div className="flex items-end gap-2.5 text-sm">
      <img src={logo} alt={config.title} className="size-6.5 mb-1.25" />
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-semibold">{config.title}</span>
        <span className="text-xs opacity-80">{config.description}</span>
      </div>
    </div>
  )
}
