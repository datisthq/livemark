import { Link, useLocation } from "@tanstack/react-router"
import { Fragment } from "react"
import { listBreadcrumbs } from "../content/article.ts"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../elements/breadcrumb.tsx"
import { activeSiteLink, activeSiteSection } from "../helpers/section.ts"
import { useMessages, useSite } from "../hooks/site.ts"
import { SiteLink } from "./SiteLink.tsx"
import { buildPathLink } from "../helpers/path-link.ts"

/** The trail from the site's home through the article's folders to the article */
export function Breadcrumbs(props: { path: string; title: string }) {
  const pathname = useLocation({ select: l => l.pathname })
  const site = useSite()
  const t = useMessages()
  const crumbs = listBreadcrumbs(props.path)
  if (!crumbs) return null
  const sections = site.config.sections ?? []
  const home = activeSiteLink(pathname, sections, site.language.prefix)
  const title = activeSiteSection(pathname, sections)?.siteTitle ?? site.config.title

  return (
    <Breadcrumb aria-label={t("nav.breadcrumbs")} className="mb-4">
      <BreadcrumbList className="sm:gap-1.5">
        <BreadcrumbItem>
          <BreadcrumbLink render={<SiteLink to={home} />}>{title}</BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((crumb, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              {crumb.path ? (
                <BreadcrumbLink render={<Link {...buildPathLink(crumb.path)} />}>
                  {crumb.title}
                </BreadcrumbLink>
              ) : (
                crumb.title
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">{props.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
