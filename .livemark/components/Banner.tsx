import { ArrowRight } from "lucide-react"
import { useSite } from "livemark/hooks/site"

const COPY = {
  en: { message: "Livemark is in technical preview", link: "Share feedback" },
  es: { message: "Livemark está en vista previa técnica", link: "Danos tu opinión" },
  zh: { message: "Livemark 正处于技术预览阶段", link: "提交反馈" },
}

export function Banner() {
  const code = useSite().language.code
  const copy = code === "es" || code === "zh" ? COPY[code] : COPY.en
  return (
    <div className="bg-banner text-banner-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center font-mono text-xs tracking-wide sm:px-6">
        <span className="min-w-0 truncate">{copy.message}</span>
        <span aria-hidden className="hidden opacity-60 sm:inline">
          ·
        </span>
        <a
          href="https://github.com/datisthq/livemark/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-1 no-underline"
        >
          {/* `sr-only`, not `hidden`: on a phone the link would be left an unnamed icon. */}
          <span className="sr-only underline underline-offset-4 group-hover:no-underline sm:not-sr-only">
            {copy.link}
          </span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5 group-active:translate-x-0.5 motion-reduce:transition-none" />
        </a>
      </div>
    </div>
  )
}
