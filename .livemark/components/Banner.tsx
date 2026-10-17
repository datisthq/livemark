import { ArrowRight } from "lucide-react"

/** Technical preview announcement strip displayed above the header */
export function Banner() {
  return (
    <div className="bg-banner text-banner-foreground">
      <div className="group relative flex items-center justify-center gap-2 px-4 py-2 text-center font-mono text-xs tracking-wide sm:px-6">
        <span className="min-w-0 truncate opacity-80">
          Livemark is in technical preview
        </span>
        <a
          href="https://github.com/datisthq/livemark/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 no-underline after:absolute after:inset-0"
        >
          <span className="sr-only underline underline-offset-4 group-hover:no-underline sm:not-sr-only">
            Share feedback
          </span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  )
}
