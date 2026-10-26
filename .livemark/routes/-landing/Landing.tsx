import { Link } from "@tanstack/react-router"
import {
  BookOpen,
  Bot,
  Braces,
  Code,
  FileCode,
  FileText,
  FolderTree,
  Github,
  LayoutPanelLeft,
  ListChecks,
  Moon,
  Paintbrush,
  Rocket,
  ScrollText,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react"
import {
  type ComponentType,
  Fragment,
  type ReactNode,
  type SVGProps,
  useRef,
  useState,
} from "react"
import { BackToTop } from "livemark/components/BackToTop"
import { Banner } from "livemark/components/Banner"
import { Header } from "livemark/components/Header"
import { buttonVariants } from "livemark/elements/button"
import { useInView } from "livemark/hooks/in-view"
import { useSite } from "livemark/hooks/site"
import { cn } from "cn"
import { type LandingCopy, type RichSegment, landingCopy } from "./copy.ts"

/** The livemark.dev landing page, in the current page's language. */
export function Landing() {
  const site = useSite()
  const copy = landingCopy[site.language.code] ?? landingCopy.en
  const prefix = site.language.prefix
  return (
    <>
      <Banner />
      <Header />
      <main className="flex flex-col">
        <Hero copy={copy} prefix={prefix} />
        <Freedom copy={copy.freedom} prefix={prefix} />
        <Features copy={copy.features} />
        <Showcase copy={copy.showcase} prefix={prefix} />
        <Agents copy={copy.agents} prefix={prefix} />
        <FinalCta copy={copy.finalCta} prefix={prefix} />
        <Datist copy={copy.datist} />
      </main>
      <BackToTop />
    </>
  )
}

// The splat carries no leading slash, so the language prefix loses its own.
function buildSplat(prefix: string, path: string) {
  return `${prefix}${path}`.slice(1)
}

function RichText(props: {
  segments: RichSegment[]
  prefix: string
  codeClassName?: string
}) {
  return props.segments.map((segment, index) => {
    if (typeof segment === "string") return segment
    if ("code" in segment) {
      return (
        <code key={index} className={props.codeClassName ?? "font-mono text-foreground"}>
          {segment.code}
        </code>
      )
    }
    return (
      <Link
        key={index}
        to="/$"
        params={{ _splat: buildSplat(props.prefix, segment.link) }}
        className="text-primary underline-offset-4 hover:underline"
      >
        {segment.text}
      </Link>
    )
  })
}

/**
 * Catppuccin-flavoured token colours for the Markdown samples.
 * Latte palette for light mode, Mocha for dark mode — matches the
 * default Shiki themes the site uses. Declared first: `slideSources` reads it at load.
 */
const tk = {
  fm: "text-[#7c7f93] dark:text-[#9399b2]", // frontmatter delimiter / punctuation
  key: "text-[#8839ef] dark:text-[#cba6f7]", // mauve
  str: "text-[#40a02b] dark:text-[#a6e3a1]", // green
  head: "text-[#d20f39] dark:text-[#f38ba8] font-bold", // red, bold
  lang: "text-[#df8e1d] dark:text-[#f9e2af]", // yellow
  directive: "text-[#179299] dark:text-[#94e2d5]", // teal
  code: "bg-[#eff1f5] dark:bg-[#313244] rounded px-1", // surface0
  bold: "font-bold text-[#4c4f69] dark:text-[#cdd6f4]",
  em: "italic text-[#4c4f69] dark:text-[#cdd6f4]",
  body: "text-[#4c4f69] dark:text-[#cdd6f4]",
  dim: "text-[#9ca0b0] dark:text-[#6c7086]",
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero(props: { copy: LandingCopy; prefix: string }) {
  const hero = props.copy.hero
  const slides = slideSources.map(source => {
    const slideCopy = props.copy.slides[source.id]
    return {
      ...source,
      title: slideCopy.title,
      shots: source.shots.map((shot, index) => ({
        ...shot,
        alt: slideCopy.alts[index] ?? "",
      })),
    }
  })
  return (
    <section className="relative overflow-hidden border-b border-border">
      <BackgroundGrid />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-12 sm:py-20 md:py-28 lg:pt-8 lg:pb-14 lg:grid lg:grid-cols-[27rem_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div className="lg:self-start lg:pt-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
          <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 text-[2rem] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-5xl">
            {hero.titleLines.map(line => (
              <Fragment key={line}>
                {line}
                <br />
              </Fragment>
            ))}
            <span className="box-decoration-clone bg-linear-to-r from-primary/20 to-primary/20 bg-size-[100%_0.3em] bg-position-[0_88%] bg-no-repeat">
              {hero.titleHighlight}
            </span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {hero.description}
          </p>
          <HeroActions copy={hero} prefix={props.prefix} />
        </div>
        <div className="mt-12 lg:mt-0 xl:w-[60rem] animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
          <HeroCarousel slides={slides} sourceLabel={hero.sourceLabel} />
        </div>
      </div>
    </section>
  )
}

function HeroActions(props: { copy: LandingCopy["hero"]; prefix: string }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
      <Link
        to="/$"
        params={{ _splat: buildSplat(props.prefix, "introduction") }}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "flex-1 px-3 no-underline sm:flex-none sm:px-5",
        )}
      >
        <Rocket className="size-4" />
        {props.copy.getStarted}
      </Link>
      <a
        href="https://github.com/datisthq/livemark"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "flex-1 px-3 no-underline sm:flex-none sm:px-5",
        )}
      >
        <Github className="size-4" />
        {props.copy.viewSource}
      </a>
    </div>
  )
}

/* ─────────────────────────── Hero carousel ─────────────────────────── */

interface Shot {
  src: string
  srcDark: string
  alt: string
}

interface Slide {
  id: string
  title: string
  shots: Shot[]
  mobile?: boolean
  source: { file: string; code: ReactNode }
}

interface SlideSource extends Omit<Slide, "title" | "shots"> {
  id: keyof LandingCopy["slides"]
  shots: Omit<Shot, "alt">[]
}

const slideSources: SlideSource[] = [
  {
    id: "docs",
    shots: [
      {
        src: "/screenshots/docs.webp",
        srcDark: "/screenshots/docs-dark.webp",
      },
    ],
    source: {
      file: "docs/code-blocks.md",
      code: (
        <>
          <span className={tk.fm}>---</span>
          {"\n"}
          <span className={tk.key}>title</span>
          <span className={tk.fm}>:</span> <span className={tk.str}>Code Blocks</span>
          {"\n"}
          <span className={tk.fm}>---</span>
          {"\n"}
          <span className={tk.dim}>```</span>
          <span className={tk.lang}>ts</span> <span className={tk.key}>title</span>
          <span className={tk.fm}>=</span>
          <span className={tk.str}>"livemark.config.ts"</span>
        </>
      ),
    },
  },
  {
    id: "blog",
    shots: [
      {
        src: "/screenshots/blog.webp",
        srcDark: "/screenshots/blog-dark.webp",
      },
    ],
    source: {
      file: "blog/hello-world.md",
      code: (
        <>
          <span className={tk.fm}>---</span>
          {"\n"}
          <span className={tk.key}>title</span>
          <span className={tk.fm}>:</span> <span className={tk.str}>Hello World</span>
          {"\n"}
          <span className={tk.key}>date</span>
          <span className={tk.fm}>:</span> <span className={tk.str}>2026-04-10</span>
          {"\n"}
          <span className={tk.key}>tags</span>
          <span className={tk.fm}>:</span> <span className={tk.str}>[announcement]</span>
          {"\n"}
          <span className={tk.fm}>---</span>
        </>
      ),
    },
  },
  {
    id: "changelog",
    shots: [
      {
        src: "/screenshots/changelog.webp",
        srcDark: "/screenshots/changelog-dark.webp",
      },
    ],
    source: {
      file: "livemark.config.ts",
      code: (
        <>
          <span className={tk.fm}>{"{"}</span> <span className={tk.key}>type</span>
          <span className={tk.fm}>:</span> <span className={tk.str}>"changelog"</span>
          <span className={tk.fm}>,</span>
          {"\n  "}
          <span className={tk.key}>source</span>
          <span className={tk.fm}>:</span> <span className={tk.str}>"CHANGELOG.md"</span>{" "}
          <span className={tk.fm}>{"}"}</span>
        </>
      ),
    },
  },
  {
    id: "mobile",
    mobile: true,
    shots: [
      {
        src: "/screenshots/mobile-sidebar.webp",
        srcDark: "/screenshots/mobile-sidebar-dark.webp",
      },
      {
        src: "/screenshots/mobile-page.webp",
        srcDark: "/screenshots/mobile-page-dark.webp",
      },
      {
        src: "/screenshots/mobile-sheet.webp",
        srcDark: "/screenshots/mobile-sheet-dark.webp",
      },
    ],
    source: {
      file: "docs/rich-elements.md",
      code: (
        <>
          <span className={tk.directive}>:::tip</span>
          {"\n"}
          Helpful advice here.
          {"\n"}
          <span className={tk.directive}>:::</span>
        </>
      ),
    },
  },
]

// Every slide is in the prerendered HTML, stacked in one grid cell; only the active
// one is visible and reachable. All shots share one aspect, so the window never jumps.
function HeroCarousel(props: { slides: Slide[]; sourceLabel: string }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [stopped, setStopped] = useState(false)
  // A bar can finish in the same frame as the click that stops it; its end event
  // still holds the old closure, so it checks this instead of `stopped`.
  const stoppedRef = useRef(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <figure className="overflow-hidden rounded-card border border-border bg-card shadow-xl">
        <div className="flex items-center gap-5 border-b border-border bg-muted/50 px-4 py-2">
          <span aria-hidden className="hidden gap-1.5 sm:flex">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </span>
          <div role="tablist" className="flex min-w-0 gap-1">
            {props.slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-controls={`hero-slide-${slide.id}`}
                onClick={() => {
                  stoppedRef.current = true
                  setActive(index)
                  setStopped(true)
                }}
                className={cn(
                  "relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-control px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                  index === active
                    ? "bg-card font-medium text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn("font-mono text-xs", index === active && "text-primary")}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={index === active ? undefined : "hidden sm:inline"}>
                  {slide.title}
                </span>
                {index === active ? (
                  <span
                    key={stopped ? "stopped" : active}
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 bottom-0.5 h-0.5 rounded-full bg-primary/70",
                      !stopped && "hero-carousel-progress",
                    )}
                    style={{ animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={() => {
                      if (stoppedRef.current) return
                      setActive(current => (current + 1) % props.slides.length)
                    }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
        <div className="grid">
          {props.slides.map((slide, index) => (
            <div
              key={slide.id}
              id={`hero-slide-${slide.id}`}
              role="tabpanel"
              aria-hidden={index !== active}
              className={cn(
                "[grid-area:1/1] transition-opacity duration-700 motion-reduce:transition-none",
                index === active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {slide.mobile ? (
                <div className="flex aspect-[16/10] items-start justify-center gap-[4%] xl:justify-start xl:gap-[3%] xl:pl-[6%] overflow-hidden bg-primary/5 pt-[5%]">
                  {slide.shots.map((shot, phone) => (
                    <div
                      key={shot.src}
                      className={cn(
                        "w-[24%] shrink-0 xl:w-[22%] overflow-hidden rounded-t-xl border-x-[3px] border-t-[3px] border-foreground/80 shadow-2xl sm:rounded-t-[1.75rem] sm:border-x-[6px] sm:border-t-[6px]",
                        phone !== 1 && "mt-[6%]",
                      )}
                    >
                      <ShotPicture shot={shot} className="h-auto w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                slide.shots.map(shot => (
                  <ShotPicture
                    key={shot.src}
                    shot={shot}
                    className="aspect-[16/10] w-full"
                  />
                ))
              )}
            </div>
          ))}
        </div>
      </figure>
      <div className="mt-4 grid grid-cols-1 lg:absolute lg:-bottom-10 lg:-left-10 lg:mt-0 lg:w-[24rem]">
        {props.slides.map((slide, index) => (
          <div
            key={slide.id}
            aria-hidden={index !== active}
            inert={index !== active}
            className={cn(
              "[grid-area:1/1] transition-opacity duration-700 motion-reduce:transition-none",
              index === active ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <SourceChip source={slide.source} label={props.sourceLabel} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SourceChip(props: { source: Slide["source"]; label: string }) {
  return (
    <figure className="flex h-full gap-3 rounded-card border border-primary/25 bg-card p-4 shadow-lg">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <FileText className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
          {props.label}
        </p>
        <figcaption className="mt-1 font-mono text-xs text-muted-foreground">
          {props.source.file}
        </figcaption>
        <pre className="mt-2 overflow-x-auto font-mono text-sm leading-relaxed">
          <code className={tk.body}>{props.source.code}</code>
        </pre>
      </div>
    </figure>
  )
}

// Two images, not `<picture media>`: the theme is a class on <html>, which a media
// query never sees. A lazy image that is `display: none` is never fetched.
function ShotPicture(props: { shot: Shot; className?: string }) {
  return (
    <>
      <img
        src={props.shot.src}
        alt={props.shot.alt}
        decoding="async"
        className={cn("block object-cover object-top dark:hidden", props.className)}
      />
      <img
        src={props.shot.srcDark}
        alt={props.shot.alt}
        decoding="async"
        className={cn("hidden object-cover object-top dark:block", props.className)}
      />
    </>
  )
}

function BackgroundGrid() {
  return (
    <>
      <style href="livemark-hero-background" precedence="default">
        {BACKGROUND_GRID_CSS}
      </style>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent_98%)]">
          <div className="strata strata-drift absolute inset-y-0 -inset-x-11 opacity-50" />
          <div className="hero-scan-x from-primary/0 via-primary/16 to-primary/0 absolute inset-y-0 w-[40%] bg-gradient-to-r" />
          <div className="hero-scan-y from-(--hero-scan-accent)/0 via-(--hero-scan-accent)/16 to-(--hero-scan-accent)/0 absolute inset-x-0 h-[40%] bg-gradient-to-b" />
        </div>
      </div>
      <div
        aria-hidden
        className="hero-drift bg-primary/15 pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full blur-3xl"
      />
    </>
  )
}

const BACKGROUND_GRID_CSS = `
:root {
  --hero-scan-accent: oklch(0.4432 0.2356 292.9);
}
.dark {
  --hero-scan-accent: oklch(0.7889 0.0983 295.7);
}

@keyframes hero-scan-x {
  0% {
    transform: translateX(-55%);
    opacity: 0;
  }
  5%,
  45% {
    opacity: 1;
  }
  50%,
  100% {
    transform: translateX(155%);
    opacity: 0;
  }
}

@keyframes hero-scan-y {
  0%,
  50% {
    transform: translateY(-55%);
    opacity: 0;
  }
  55%,
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(155%);
    opacity: 0;
  }
}

@keyframes strata-drift {
  to {
    transform: translateX(44px);
  }
}

@keyframes hero-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(6%, -8%, 0) scale(1.08);
  }
}

.strata {
  background-image: repeating-linear-gradient(
    90deg,
    var(--color-border) 0,
    var(--color-border) 1px,
    transparent 1px,
    transparent 44px
  );
}

.strata-drift {
  animation: strata-drift 14s linear infinite;
}

.hero-scan-x {
  animation: hero-scan-x 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hero-scan-y {
  animation: hero-scan-y 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hero-drift {
  animation: hero-drift 18s ease-in-out infinite;
}

@keyframes hero-carousel-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.hero-carousel-progress {
  transform-origin: left;
  animation: hero-carousel-progress 6s linear;
}

@media (prefers-reduced-motion: reduce) {
  .hero-scan-x,
  .hero-scan-y {
    animation: none;
    opacity: 0;
  }
  .strata-drift,
  .hero-drift,
  .hero-carousel-progress {
    animation: none;
  }
}
`

/* ─────────────────────────── Freedom ─────────────────────────── */

type Icon = ComponentType<SVGProps<SVGSVGElement>>

const freedoms: { id: keyof LandingCopy["freedom"]["points"]; icon: Icon }[] = [
  { id: "layout", icon: FolderTree },
  { id: "pages", icon: FileCode },
  { id: "tailwind", icon: Paintbrush },
]

function Freedom(props: { copy: LandingCopy["freedom"]; prefix: string }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {props.copy.title}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">{props.copy.description}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <ul className="space-y-8">
            {freedoms.map((f, i) => (
              <li key={f.id}>
                <Reveal delayMs={i * 60}>
                  <PointItem
                    icon={f.icon}
                    point={props.copy.points[f.id]}
                    prefix={props.prefix}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal>
            <WindowCard label={props.copy.repoLabel}>
              <RepoTree />
            </WindowCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function PointItem(props: {
  icon: Icon
  point: { title: string; description: RichSegment[] }
  prefix: string
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
        <props.icon className="size-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{props.point.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          <RichText segments={props.point.description} prefix={props.prefix} />
        </p>
      </div>
    </div>
  )
}

function RepoTree() {
  return (
    <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
      <code className={tk.body}>
        <span className={tk.directive}>.livemark/</span>
        {"\n"}
        <span className={tk.dim}>└─ </span>
        <span className={tk.directive}>routes/</span>
        {"\n"}
        <span className={tk.dim}>{"   ├─ "}</span>
        <span className={tk.head}>pricing.tsx</span>
        <span className={cn(tk.dim, "hidden sm:inline")}>{"   ← a React page"}</span>
        {"\n"}
        <span className={tk.dim}>{"   └─ "}</span>
        <span className={tk.head}>dashboard.tsx</span>
        {"\n"}
        <span className={tk.directive}>guides/</span>
        {"\n"}
        <span className={tk.dim}>├─ </span>
        <span className={tk.str}>setup.md</span>
        {"\n"}
        <span className={tk.dim}>└─ </span>
        <span className={tk.str}>faq.md</span>
        {"\n"}
        <span className={tk.directive}>src/</span>
        <span className={cn(tk.dim, "hidden sm:inline")}>
          {"               ← your code, untouched"}
        </span>
        {"\n"}
        <span className={tk.str}>README.md</span>
        <span className={cn(tk.dim, "hidden sm:inline")}>{"          ← a page too"}</span>
        {"\n"}
        <span className={tk.str}>CHANGELOG.md</span>
        {"\n"}
        <span className={tk.key}>livemark.config.ts</span>
      </code>
    </pre>
  )
}

/* ─────────────────────────── Features ─────────────────────────── */

const features: { id: keyof LandingCopy["features"]["items"]; icon: Icon }[] = [
  { id: "shiki", icon: Code },
  { id: "diagrams", icon: Workflow },
  { id: "syntax", icon: ListChecks },
  { id: "mdx", icon: Braces },
  { id: "mobile", icon: Smartphone },
  { id: "sections", icon: LayoutPanelLeft },
  { id: "search", icon: Search },
  { id: "theme", icon: Moon },
  { id: "preview", icon: Zap },
]

function Features(props: { copy: LandingCopy["features"] }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {props.copy.title}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">{props.copy.description}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Reveal key={f.id} delayMs={i * 60}>
              <FeatureCard icon={f.icon} {...props.copy.items[f.id]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard(props: { icon: Icon; title: string; description: string }) {
  return (
    <div className="h-full group relative rounded-card border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/15 transition-colors">
        <props.icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{props.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {props.description}
      </p>
    </div>
  )
}

/* ─────────────────────────── Showcase ─────────────────────────── */

function MarkdownSample() {
  return (
    <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
      <code className={tk.body}>
        <span className={tk.fm}>---</span>
        {"\n"}
        <span className={tk.key}>title</span>
        <span className={tk.fm}>:</span> <span className={tk.str}>Quickstart</span>
        {"\n"}
        <span className={tk.key}>icon</span>
        <span className={tk.fm}>:</span> <span className={tk.str}>rocket</span>
        {"\n"}
        <span className={tk.fm}>---</span>
        {"\n\n"}
        <span className={tk.head}># Quickstart</span>
        {"\n\n"}
        Install the package:
        {"\n\n"}
        <span className={tk.dim}>```</span>
        <span className={tk.lang}>bash</span>
        {"\n"}
        npm install livemark
        {"\n"}
        <span className={tk.dim}>```</span>
        {"\n\n"}
        <span className={tk.directive}>:::tip</span>
        {"\n"}
        Run <span className={tk.code}>livemark dev</span> and open the browser.
        {"\n"}
        <span className={tk.directive}>:::</span>
        {"\n\n"}
        <span className={tk.head}>## Features</span>
        {"\n\n"}
        <span className={tk.dim}>-</span> <span className={tk.bold}>**Fast**</span>{" "}
        rebuilds with Vite
        {"\n"}
        <span className={tk.dim}>-</span> <span className={tk.bold}>**MDX**</span>{" "}
        components when you need them
        {"\n"}
        <span className={tk.dim}>-</span> <span className={tk.em}>_Beautiful_</span> out
        of the box
      </code>
    </pre>
  )
}

function Showcase(props: { copy: LandingCopy["showcase"]; prefix: string }) {
  return (
    <section className="border-b border-border bg-primary/5">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {props.copy.title}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              <RichText
                segments={props.copy.description}
                prefix={props.prefix}
                codeClassName="font-mono"
              />
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <WindowCard label="quickstart.md">
              <MarkdownSample />
            </WindowCard>
            <WindowCard label={props.copy.renderedLabel}>
              <div className="p-6">
                <h3 className="text-2xl font-bold">Quickstart</h3>
                <p className="mt-3 text-sm text-muted-foreground">Install the package:</p>
                <div className="mt-3 rounded-md bg-[#1e1e2e] text-[#cdd6f4] p-3 font-mono text-xs">
                  <span className="text-[#cba6f7]">npm</span>{" "}
                  <span className="text-[#a6e3a1]">install</span>{" "}
                  <span className="text-[#f9e2af]">livemark</span>
                </div>
                <div className="mt-4 rounded-md border-l-4 border-primary bg-primary/5 px-4 py-3">
                  <div className="text-xs font-semibold text-primary mb-1">TIP</div>
                  <p className="text-sm text-foreground">
                    Run{" "}
                    <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                      livemark start
                    </code>{" "}
                    and open the browser.
                  </p>
                </div>
                <h4 className="mt-5 font-semibold">Features</h4>
                <ul className="mt-2 text-sm text-foreground space-y-1">
                  <li>
                    · <strong>Fast</strong> rebuilds with Vite
                  </li>
                  <li>
                    · <strong>MDX</strong> components when you need them
                  </li>
                  <li>
                    · <em>Beautiful</em> out of the box
                  </li>
                </ul>
              </div>
            </WindowCard>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function WindowCard(props: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-primary/20 bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-primary/20 px-4 py-2 bg-muted/50">
        <div className="size-2.5 rounded-full bg-red-400/60" />
        <div className="size-2.5 rounded-full bg-yellow-400/60" />
        <div className="size-2.5 rounded-full bg-green-400/60" />
        <span className="ml-2 text-xs font-mono text-muted-foreground">
          {props.label}
        </span>
      </div>
      {props.children}
    </div>
  )
}

/* ─────────────────────────── Agents ─────────────────────────── */

const agentPoints: { id: keyof LandingCopy["agents"]["points"]; icon: Icon }[] = [
  { id: "twin", icon: FileText },
  { id: "llms", icon: ScrollText },
  { id: "signals", icon: ShieldCheck },
  { id: "skills", icon: Sparkles },
  { id: "coding", icon: Bot },
]

function Agents(props: { copy: LandingCopy["agents"]; prefix: string }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {props.copy.title}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">{props.copy.description}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <Reveal>
            <WindowCard label={props.copy.terminalLabel}>
              <AgentRequest />
            </WindowCard>
          </Reveal>
          <ul className="space-y-8">
            {agentPoints.map((p, i) => (
              <li key={p.id}>
                <Reveal delayMs={i * 60}>
                  <PointItem
                    icon={p.icon}
                    point={props.copy.points[p.id]}
                    prefix={props.prefix}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <Reveal>
          <div className="mt-10 text-center md:mt-12">
            <Link
              to="/$"
              params={{ _splat: buildSplat(props.prefix, props.copy.more.link) }}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {props.copy.more.text}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function AgentRequest() {
  return (
    <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
      <code className={tk.body}>
        <span className={tk.dim}>$ </span>
        <span className={tk.key}>curl</span> <span className={tk.lang}>-H</span>{" "}
        <span className={tk.str}>"Accept: text/markdown"</span> \{"\n"}
        {"    "}livemark.dev/introduction/
        {"\n\n"}
        <span className={tk.dim}>HTTP/2 200</span>
        {"\n"}
        <span className={tk.dim}>content-type: text/markdown</span>
        {"\n\n"}
        <span className={tk.head}># Introduction</span>
        {"\n\n"}
        <span className={tk.directive}>{">"}</span> Learn how to set up your
        {"\n"}
        <span className={tk.directive}>{">"}</span> first Livemark project.
        {"\n\n"}
        <span className={tk.head}>## What you get</span>
        {"\n\n"}
        <span className={tk.dim}>-</span>{" "}
        <span className={tk.bold}>**Just write Markdown.**</span>
        {"\n"}
        {"  "}GitHub-flavored Markdown works out
        {"\n"}
        {"  "}of the box, with footnotes and gemoji.
        {"\n\n"}
        <span className={tk.directive}>:::tip</span>
        {"\n"}
        Every page has a twin like this one —{"\n"}
        list them all at <span className={tk.code}>/llms.txt</span>.{"\n"}
        <span className={tk.directive}>:::</span>
      </code>
    </pre>
  )
}

/* ─────────────────────────── Datist ─────────────────────────── */

function Datist(props: { copy: LandingCopy["datist"] }) {
  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {props.copy.builtBy}
            </p>
            <a
              href="https://datist.io"
              target="_blank"
              rel="noopener"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors no-underline"
            >
              {props.copy.tagline}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────── Final CTA ─────────────────────────── */

function FinalCta(props: { copy: LandingCopy["finalCta"]; prefix: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {props.copy.titleLead}{" "}
            <span className="text-primary">{props.copy.titleHighlight}</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">{props.copy.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10">
            <Link
              to="/$"
              params={{ _splat: buildSplat(props.prefix, "introduction") }}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "flex-1 px-3 no-underline sm:flex-none sm:px-5",
              )}
            >
              <BookOpen className="size-4" />
              {props.copy.readDocs}
            </Link>
            <Link
              to="/$"
              params={{ _splat: "changelog" }}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "flex-1 px-3 no-underline sm:flex-none sm:px-5",
              )}
            >
              {props.copy.whatsNew}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────── Reveal helper ─────────────────────────── */

function Reveal(props: { children: ReactNode; delayMs?: number }) {
  const { ref, isVisible } = useInView()
  return (
    <div
      ref={ref as (node: HTMLDivElement | null) => void}
      style={{ transitionDelay: `${props.delayMs ?? 0}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      {props.children}
    </div>
  )
}
