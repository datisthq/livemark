import { Link, createFileRoute } from "@tanstack/react-router"
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
import { cn } from "cn"

export const Route = createFileRoute("/")({
  component: Landing,
})

function Landing() {
  return (
    <>
      <Banner />
      <Header />
      <main className="flex flex-col">
        <Hero />
        <Freedom />
        <Features />
        <Showcase />
        <Agents />
        <FinalCta />
        <Datist />
      </main>
      <BackToTop />
    </>
  )
}

/**
 * Catppuccin-flavoured token colours for the Markdown samples.
 * Latte palette for light mode, Mocha for dark mode — matches the
 * default Shiki themes the site uses. Declared first: `slides` reads it at load.
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

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <BackgroundGrid />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28 lg:grid lg:grid-cols-[27rem_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
          <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            Beautiful out of the box
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-5xl">
            Markdown sites,
            <br />
            <span className="box-decoration-clone bg-linear-to-r from-primary/20 to-primary/20 bg-size-[100%_0.3em] bg-position-[0_88%] bg-no-repeat">
              your way.
            </span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
            Keep your files where they are, add TanStack Start pages, restyle everything
            with Tailwind, and get docs, a blog and a changelog that shine on every
            screen.
          </p>
          <HeroActions />
        </div>
        <div className="mt-12 lg:mt-0 xl:w-[60rem] animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
          <HeroCarousel slides={slides} />
        </div>
      </div>
    </section>
  )
}

function HeroActions() {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <Link
        to="/$"
        params={{ _splat: "introduction" }}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "px-5 no-underline",
        )}
      >
        <Rocket className="size-4" />
        Get started
      </Link>
      <a
        href="https://github.com/datisthq/livemark"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "px-5 no-underline",
        )}
      >
        <Github className="size-4" />
        View source
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

const slides: Slide[] = [
  {
    id: "docs",
    title: "Docs",
    shots: [
      {
        src: "/screenshots/docs.webp",
        srcDark: "/screenshots/docs-dark.webp",
        alt: "A Livemark docs page with a sidebar, a highlighted code block and a table of contents",
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
    title: "Blog",
    shots: [
      {
        src: "/screenshots/blog.webp",
        srcDark: "/screenshots/blog-dark.webp",
        alt: "A Livemark blog index listing posts with dates, authors and tags",
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
    title: "Changelog",
    shots: [
      {
        src: "/screenshots/changelog.webp",
        srcDark: "/screenshots/changelog-dark.webp",
        alt: "A Livemark changelog listing releases with their dates",
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
    title: "Mobile",
    mobile: true,
    shots: [
      {
        src: "/screenshots/mobile-sidebar.webp",
        srcDark: "/screenshots/mobile-sidebar-dark.webp",
        alt: "The Livemark sidebar open on a phone, with the section picker and articles",
      },
      {
        src: "/screenshots/mobile-page.webp",
        srcDark: "/screenshots/mobile-page-dark.webp",
        alt: "A Livemark docs page on a phone, showing note, tip, warning and danger callouts",
      },
      {
        src: "/screenshots/mobile-sheet.webp",
        srcDark: "/screenshots/mobile-sheet-dark.webp",
        alt: "The page contents open as a bottom sheet on a phone",
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
function HeroCarousel(props: { slides: Slide[] }) {
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
      <div className="mt-4 grid grid-cols-1 lg:absolute lg:top-[55%] lg:-left-10 lg:mt-0 lg:w-[22rem]">
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
            <SourceChip source={slide.source} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SourceChip(props: { source: Slide["source"] }) {
  return (
    <figure className="flex h-full gap-3 rounded-card border border-primary/25 bg-card p-4 shadow-lg">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <FileText className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
          Written in plain Markdown
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

interface FreedomPoint {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: ReactNode
}

const freedoms: FreedomPoint[] = [
  {
    icon: FolderTree,
    title: "Any file layout",
    description: (
      <>
        Point <code className="font-mono text-foreground">include</code> globs at the
        Markdown you already have. README, CONTRIBUTING and CHANGELOG become pages too.
      </>
    ),
  },
  {
    icon: FileCode,
    title: "Real TanStack Start pages",
    description: (
      <>
        Drop a <code className="font-mono text-foreground">.tsx</code> file into{" "}
        <code className="font-mono text-foreground">.livemark/routes/</code> for pricing,
        dashboards or anything else. This landing page is one.
      </>
    ),
  },
  {
    icon: Paintbrush,
    title: "Tailwind, fully customizable",
    description: (
      <>
        Built on Tailwind v4 and shadcn-style primitives. Restyle with CSS tokens, use
        utilities in your own pages, or{" "}
        <Link
          to="/$"
          params={{ _splat: "customization/overriding-escaping" }}
          className="text-primary underline-offset-4 hover:underline"
        >
          escape any component
        </Link>{" "}
        under <code className="font-mono text-foreground">.livemark/</code>.
      </>
    ),
  },
]

function Freedom() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Stays out of your way
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              No required folder structure, no lock-in. Livemark adapts to your repo, not
              the other way round.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <ul className="space-y-8">
            {freedoms.map((f, i) => (
              <li key={f.title}>
                <Reveal delayMs={i * 60}>
                  <div className="flex gap-4">
                    <div className="shrink-0 inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                      <f.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal>
            <WindowCard label="your-repo">
              <RepoTree />
            </WindowCard>
          </Reveal>
        </div>
      </div>
    </section>
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

interface Feature {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Code,
    title: "Shiki syntax highlighting",
    description:
      "100+ languages, Catppuccin themes, diffs, line highlights, and TwoSlash type hints out of the box.",
  },
  {
    icon: Workflow,
    title: "Diagrams & math",
    description:
      "Mermaid flowcharts and KaTeX equations, theme-aware, zero config. Just write them in your Markdown.",
  },
  {
    icon: ListChecks,
    title: "Rich Markdown syntax",
    description:
      "Callouts, tabs, steps, cards, file trees, badges and more — plain directives, no JSX required.",
  },
  {
    icon: Braces,
    title: "MDX components",
    description:
      "Drop JSX components into Markdown when you need power — stay plain when you don't.",
  },
  {
    icon: Smartphone,
    title: "Perfect on mobile",
    description:
      "Bottom-sheet navigation, page contents a tap away, and no sideways scroll on any phone.",
  },
  {
    icon: LayoutPanelLeft,
    title: "Docs, blog & changelog",
    description:
      "Multiple content sections with tags, dates, and auto-generated index pages, all from configuration.",
  },
  {
    icon: Search,
    title: "Search & navigation",
    description:
      "Orama full-text search, per-section sidebars, keyboard shortcuts, and smart table-of-contents.",
  },
  {
    icon: Moon,
    title: "Dark mode & theme tokens",
    description:
      "Built-in dark mode, light/dark image variants, CSS variables like --primary, and swappable Shiki themes.",
  },
  {
    icon: Zap,
    title: "Fast static output",
    description:
      "A fully static build with sitemap, robots and RSS — ready for any host in seconds.",
  },
]

function Features() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Beautiful by default
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Rich Markdown, a polished mobile experience and sensible defaults. Customize
              only what you want.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delayMs={i * 60}>
              <FeatureCard {...f} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="h-full group relative rounded-card border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/15 transition-colors">
        <Icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
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

function Showcase() {
  return (
    <section className="border-b border-border bg-primary/5">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Write Markdown. Ship a website.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Your <code className="font-mono">.md</code> files stay as they are —
              Livemark does the rest.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <WindowCard label="quickstart.md">
              <MarkdownSample />
            </WindowCard>
            <WindowCard label="rendered">
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
                      livemark dev
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

const agentPoints: FreedomPoint[] = [
  {
    icon: FileText,
    title: "A Markdown twin of every page",
    description: (
      <>
        Each page gets an <code className="font-mono text-foreground">index.md</code>{" "}
        beside its HTML, linked from the page head. One CDN rule serves it to requests
        that send <code className="font-mono text-foreground">Accept: text/markdown</code>
        .
      </>
    ),
  },
  {
    icon: ScrollText,
    title: "llms.txt out of the box",
    description: (
      <>
        An <code className="font-mono text-foreground">llms.txt</code> index of every
        twin, grouped by section and advertised in a{" "}
        <code className="font-mono text-foreground">Link</code> header on the home page.
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Content signals",
    description: (
      <>
        <code className="font-mono text-foreground">robots.txt</code> states whether your
        pages may be used for search, AI answers or model training. One config option
        changes it.
      </>
    ),
  },
  {
    icon: Sparkles,
    title: "Agent skills",
    description: (
      <>
        Point <code className="font-mono text-foreground">skills</code> at your{" "}
        <code className="font-mono text-foreground">SKILL.md</code> files and they are
        published under{" "}
        <code className="font-mono text-foreground">/.well-known/agent-skills/</code>.
      </>
    ),
  },
  {
    icon: Bot,
    title: "Skills for your coding agent",
    description: (
      <>
        <code className="font-mono text-foreground">
          npx skills add https://livemark.dev
        </code>{" "}
        teaches Claude Code, Cursor or Codex to{" "}
        <Link
          to="/$"
          params={{ _splat: "agent-skills" }}
          className="text-primary underline-offset-4 hover:underline"
        >
          write, configure and customize
        </Link>{" "}
        your Livemark site.
      </>
    ),
  },
]

function Agents() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready for AI agents
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Every build publishes your site in the formats AI agents look for, alongside
              the HTML for people. No configuration needed.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <Reveal>
            <WindowCard label="terminal">
              <AgentRequest />
            </WindowCard>
          </Reveal>
          <ul className="space-y-8">
            {agentPoints.map((p, i) => (
              <li key={p.title}>
                <Reveal delayMs={i * 60}>
                  <div className="flex gap-4">
                    <div className="shrink-0 inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                      <p.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <Reveal>
          <div className="mt-12 text-center">
            <Link
              to="/$"
              params={{ _splat: "customization/ai-agents" }}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              How Livemark serves AI agents →
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
        {"  "}GitHub-flavored Markdown works…
      </code>
    </pre>
  )
}

/* ─────────────────────────── Datist ─────────────────────────── */

function Datist() {
  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Built by
            </p>
            <a
              href="https://datist.io"
              target="_blank"
              rel="noopener"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors no-underline"
            >
              Datist — Software development, end to end.
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────── Final CTA ─────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Start writing.{" "}
            <span className="text-primary">Let Livemark handle the rest.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Point Livemark at the Markdown you already have, add pages when you need them,
            deploy. That's the whole setup.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/$"
              params={{ _splat: "introduction" }}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "px-5 no-underline",
              )}
            >
              <BookOpen className="size-4" />
              Read the docs
            </Link>
            <Link
              to="/$"
              params={{ _splat: "changelog" }}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "px-5 no-underline",
              )}
            >
              See what's new
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
