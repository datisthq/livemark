import logo from "../assets/logo.svg"

/** Renders the site title and description in the sidebar header */
export function SiteTitle() {
  return (
    <>
      <img
        src={logo}
        alt={import.meta.env.CONFIG.title}
        className="size-8 rounded-lg"
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
