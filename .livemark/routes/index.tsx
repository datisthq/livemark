import { Link, createFileRoute } from "@tanstack/react-router"
import {
  ArrowRight,
  Braces,
  Code,
  Github,
  LayoutPanelLeft,
  Moon,
  Search,
  Workflow,
} from "lucide-react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { buttonVariants } from "../../source/elements/button.tsx"
import { useInView } from "../../source/hooks/in-view.ts"
import { cn } from "../../source/utils/style.ts"

export const Route = createFileRoute("/")({
  component: Landing,
})

function Landing() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Showcase />
      <FinalCta />
      <Stack />
    </div>
  )
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border flex items-center min-h-[calc(100vh-4rem)]">
      <BackgroundGrid />
      <div className="relative w-full mx-auto max-w-5xl px-6 py-16 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
          Beautiful docs from{" "}
          <span className="relative inline-block">
            <span className="relative z-10">plain Markdown</span>
            <span
              aria-hidden
              className="absolute left-0 right-0 bottom-1 md:bottom-2 h-3 md:h-4 bg-primary/20 -z-0 rounded"
            />
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Livemark turns your{" "}
          <code className="font-mono text-foreground">.md</code> files into a
          fast, modern documentation site — with Shiki, Mermaid, LaTeX, MDX
          components, blog and changelog sections, all built in.
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
            Get started
            <ArrowRight className="size-4" />
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

        <div className="mt-10 inline-flex items-center gap-3 rounded-lg border border-border bg-card/50 backdrop-blur px-4 py-2.5 font-mono text-sm text-muted-foreground">
          <span className="text-primary select-none">$</span>
          <span>
            <span className="text-foreground">npm install</span> livemark
          </span>
        </div>
      </div>
    </section>
  )
}

function BackgroundGrid() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[40rem] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent dark:from-primary/30 dark:via-primary/10 pointer-events-none"
      />
    </>
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
    icon: Braces,
    title: "MDX components",
    description:
      "Drop JSX components into Markdown when you need power — stay plain when you don't.",
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
    title: "Dark mode & themes",
    description:
      "Built-in dark mode, image variants for light/dark, and fully customizable Shiki themes.",
  },
]

function Features() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything a modern doc site needs
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Opinionated defaults, zero config to start, fully customizable
              when you need it.
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
    <div className="h-full group relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/15 transition-colors">
        <Icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

/* ─────────────────────────── Showcase ─────────────────────────── */

/**
 * Catppuccin-flavoured token colours for the Markdown showcase.
 * Latte palette for light mode, Mocha for dark mode — matches the
 * default Shiki themes the site uses.
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

function MarkdownSample() {
  return (
    <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
      <code className={tk.body}>
        <span className={tk.fm}>---</span>
        {"\n"}
        <span className={tk.key}>title</span>
        <span className={tk.fm}>:</span>{" "}
        <span className={tk.str}>Quickstart</span>
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
        <span className={tk.dim}>-</span>{" "}
        <span className={tk.bold}>**Fast**</span> rebuilds with Vite
        {"\n"}
        <span className={tk.dim}>-</span>{" "}
        <span className={tk.bold}>**MDX**</span> components when you need them
        {"\n"}
        <span className={tk.dim}>-</span>{" "}
        <span className={tk.em}>_Beautiful_</span> out of the box
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
              Your <code className="font-mono">.md</code> files stay as they are
              — Livemark does the rest.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-primary/20 px-4 py-2 bg-muted/50">
                <div className="size-2.5 rounded-full bg-red-400/60" />
                <div className="size-2.5 rounded-full bg-yellow-400/60" />
                <div className="size-2.5 rounded-full bg-green-400/60" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  quickstart.md
                </span>
              </div>
              <MarkdownSample />
            </div>
            <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-primary/20 px-4 py-2 bg-muted/50">
                <div className="size-2.5 rounded-full bg-red-400/60" />
                <div className="size-2.5 rounded-full bg-yellow-400/60" />
                <div className="size-2.5 rounded-full bg-green-400/60" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  rendered
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold">Quickstart</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Install the package:
                </p>
                <div className="mt-3 rounded-md bg-[#1e1e2e] text-[#cdd6f4] p-3 font-mono text-xs">
                  <span className="text-[#cba6f7]">npm</span>{" "}
                  <span className="text-[#a6e3a1]">install</span>{" "}
                  <span className="text-[#f9e2af]">livemark</span>
                </div>
                <div className="mt-4 rounded-md border-l-4 border-primary bg-primary/5 px-4 py-3">
                  <div className="text-xs font-semibold text-primary mb-1">
                    TIP
                  </div>
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────── Stack ─────────────────────────── */

const stackItems = [
  "React 19",
  "TanStack Start",
  "MDX 2",
  "Shiki",
  "Tailwind v4",
  "Mermaid",
]

function Stack() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Built on modern, battle-tested foundations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {stackItems.map(item => (
                <span
                  key={item}
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
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
            Install, point to a folder of Markdown, deploy. That's the whole
            setup.
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
              Read the docs
              <ArrowRight className="size-4" />
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
