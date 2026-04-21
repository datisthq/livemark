import { Link, useLocation, useMatch } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { ExternalLink } from "lucide-react"
import {
  currentSection,
  sectionFirstArticle,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import { sectionIcon } from "../helpers/section.ts"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../elements/sidebar.tsx"
import { BackToTop } from "./BackToTop.tsx"
import { Banner } from "./Banner.tsx"
import { BlogSidebar } from "./BlogSidebar.tsx"
import { ChangelogSidebar } from "./ChangelogSidebar.tsx"
import { Sidebar } from "./Sidebar.tsx"
import { SiteTitle } from "./SiteTitle.tsx"

function splatFor(pathname: string) {
  return { _splat: pathname.replace(/^\/|\/$/g, "") }
}

export function Layout(props: {
  withSidebar?: boolean
  children?: React.ReactNode
}) {
  const pathname = useLocation({ select: l => l.pathname })
  const articleRoute = useMatch({ from: "/$", shouldThrow: false })
  const activeSection = articleRoute
    ? currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
    : undefined

  useHotkey("J", () =>
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" }),
  )
  useHotkey("K", () =>
    window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" }),
  )

  const sections = import.meta.env.CONFIG.sections

  const header = (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center bg-background">
      <div
        className={`flex items-center self-stretch pl-4 border-b ${props.withSidebar ? "pr-4" : "md:pr-20"}`}
      >
        {props.withSidebar ? (
          <SidebarTrigger />
        ) : (
          <Link to="/" className="flex items-center gap-2 px-2">
            <SiteTitle />
          </Link>
        )}
      </div>
      <div className="flex flex-1 items-center gap-8 self-stretch border-b px-6 text-sm">
        {sections?.length ? (
          sections
            .filter(section => section.position === "header")
            .map(section => {
              const isActive = activeSection?.prefix === section.prefix
              const target =
                section.type === "blog" || section.type === "changelog"
                  ? section.prefix
                  : sectionFirstArticle.get(section.prefix)
              const latestVersion =
                section.type === "changelog" && section.version
                  ? sortedArticles.find(
                      a =>
                        a.path === sectionFlatArticles.get(section.prefix)?.[0],
                    )?.title
                  : undefined
              return (
                <Link
                  key={section.prefix}
                  to={target === "/" ? "/" : "/$"}
                  params={target && target !== "/" ? splatFor(target) : {}}
                  className={`inline-flex items-center gap-1.5 text-foreground ${
                    isActive
                      ? "font-medium border-b-2 border-foreground pb-0.5 -mb-0.5"
                      : "opacity-80 hover:opacity-100 transition-opacity"
                  }`}
                >
                  <DynamicIcon
                    name={sectionIcon(section)}
                    className="size-3.5"
                  />
                  <span>
                    {section.title}
                    {latestVersion && (
                      <span className="opacity-60"> ({latestVersion})</span>
                    )}
                  </span>
                </Link>
              )
            })
        ) : (
          <Link
            to="/"
            className="text-foreground font-medium underline underline-offset-4"
          >
            Docs
          </Link>
        )}
        {import.meta.env.CONFIG.links
          ?.filter(
            link =>
              link.position === "header" &&
              (!link.prefix || link.prefix === activeSection?.prefix),
          )
          .map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground opacity-80 hover:opacity-100 transition-opacity"
            >
              {link.icon && (
                <DynamicIcon
                  name={link.icon}
                  className="inline size-3.5 align-[-0.125em]"
                />
              )}{" "}
              {link.title}{" "}
              <ExternalLink className="inline size-3 align-[-0.125em]" />
            </a>
          ))}
        <Banner />
      </div>
    </header>
  )

  if (!props.withSidebar) {
    return (
      <div className="flex min-h-screen flex-col">
        {header}
        <main className="flex-1">{props.children}</main>
        <BackToTop />
      </div>
    )
  }

  const SidebarComponent =
    activeSection?.type === "blog"
      ? BlogSidebar
      : activeSection?.type === "changelog"
        ? ChangelogSidebar
        : Sidebar

  return (
    <SidebarProvider>
      <SidebarComponent />
      <SidebarInset>
        {header}
        <main className="flex-1">{props.children}</main>
        <BackToTop />
      </SidebarInset>
    </SidebarProvider>
  )
}
