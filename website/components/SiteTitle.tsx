/** Renders the site title and description in the sidebar header */
export function SiteTitle() {
  return (
    <>
      <img
        src="/logo.svg"
        alt={import.meta.env.SITE_TITLE}
        className="size-8 rounded-lg"
      />
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-semibold">{import.meta.env.SITE_TITLE}</span>
        <span className="text-xs">{import.meta.env.SITE_DESCRIPTION}</span>
      </div>
    </>
  )
}
