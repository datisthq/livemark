import defaultLogo from "../assets/logo.svg"

/** Renders the site logo, title, and description in the sidebar header */
export function SiteTitle() {
  const logo = import.meta.env.CONFIG.logo ?? defaultLogo
  return (
    <div className="flex items-end gap-2.5">
      <img
        src={logo}
        alt={import.meta.env.CONFIG.title}
        className="size-6.5 mb-1.25"
      />
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-semibold">{import.meta.env.CONFIG.title}</span>
        <span className="text-xs opacity-80">
          {import.meta.env.CONFIG.description}
        </span>
      </div>
    </div>
  )
}
