import defaultLogo from "../assets/logo.svg"

/** Renders the site logo, title, and description in the sidebar header */
export function SiteTitle() {
  const logo = import.meta.env.CONFIG.logo ?? defaultLogo
  const isSvg = logo.endsWith(".svg") || logo.startsWith("data:image/svg")

  return (
    <>
      <img
        src={logo}
        alt={import.meta.env.CONFIG.title}
        className={`rounded-lg ${isSvg ? "size-8" : "h-8 w-auto"}`}
      />
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-semibold">{import.meta.env.CONFIG.title}</span>
        <span className="text-xs opacity-80">
          {import.meta.env.CONFIG.description}
        </span>
      </div>
    </>
  )
}
