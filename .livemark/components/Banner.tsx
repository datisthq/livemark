import { ArrowRight } from "lucide-react"
import { useSite } from "livemark/hooks/site"

const COPY = {
  en: {
    message: "Livemark is in technical preview",
    short: "Technical preview",
    link: "Share feedback",
  },
  es: {
    message: "Livemark está en vista previa técnica",
    short: "Vista previa técnica",
    link: "Danos tu opinión",
  },
  zh: { message: "Livemark 正处于技术预览阶段", short: "技术预览", link: "提交反馈" },
}

export function Banner() {
  const code = useSite().language.code
  const copy = code === "es" || code === "zh" ? COPY[code] : COPY.en
  return (
    <div className="bg-banner text-banner-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center font-mono text-xs tracking-wide sm:px-6">
        <span className="min-w-0 truncate">
          <span className="hidden sm:inline">{copy.message}</span>
          <span className="sm:hidden">{copy.short}</span>
        </span>
        <span aria-hidden className="opacity-60">
          ·
        </span>
        <a
          href="https://github.com/datisthq/livemark/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-1 no-underline"
        >
          <span className="underline underline-offset-4 group-hover:no-underline">
            {copy.link}
          </span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5 group-active:translate-x-0.5 motion-reduce:transition-none" />
        </a>
      </div>
    </div>
  )
}
