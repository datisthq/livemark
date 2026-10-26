import { useSite } from "../hooks/site.ts"

/** Announcement strip above the header, rendered from the `banner` config option. */
export function Banner() {
  const bannerHtml = useSite().bannerHtml
  if (!bannerHtml) return null
  return (
    <div className="bg-banner text-banner-foreground">
      <div
        className="min-w-0 px-4 py-2 text-center font-mono text-xs tracking-wide text-balance sm:px-6 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:no-underline [&_code]:font-semibold"
        dangerouslySetInnerHTML={{ __html: bannerHtml }}
      />
    </div>
  )
}
