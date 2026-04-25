import { TanStackDevtools } from "@tanstack/react-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useMatch,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type * as React from "react"
import { Layout } from "../components/Layout.tsx"
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary.tsx"
import { NotFound } from "../components/NotFound.tsx"
import { Toaster } from "../elements/sonner.tsx"
import { faviconType } from "../helpers/favicon.ts"
import defaultFavicon from "../assets/logo.svg"
import generalCss from "../styles/general.css?url"

export const Route = createRootRoute({
  head: () => {
    const favicon =
      import.meta.env.CONFIG.favicon ??
      import.meta.env.CONFIG.logo ??
      defaultFavicon
    return {
      meta: [
        { charSet: "utf-8" },
        { title: import.meta.env.CONFIG.title },
        { name: "description", content: import.meta.env.CONFIG.description },
        { property: "og:title", content: import.meta.env.CONFIG.title },
        {
          property: "og:description",
          content: import.meta.env.CONFIG.description,
        },
        { property: "og:site_name", content: import.meta.env.CONFIG.title },
        { property: "og:type", content: "website" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
      links: [
        { rel: "icon", href: favicon, type: faviconType(favicon) },
        { rel: "stylesheet", href: generalCss },
      ],
    }
  },
  notFoundComponent: () => <NotFound />,
  errorComponent: props => {
    return (
      <Document>
        <DefaultCatchBoundary {...props} />
      </Document>
    )
  },
  component: () => {
    return (
      <Document>
        <Outlet />
      </Document>
    )
  },
})

function Document(props: { children: React.ReactNode }) {
  const articleRoute = useMatch({ from: "/$", shouldThrow: false })
  const withSidebar = articleRoute?.loaderData?.sidebar

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Layout withSidebar={withSidebar}>{props.children}</Layout>
        <Toaster position="top-center" />
        <TanStackDevtools
          config={{ hideUntilHover: true, position: "bottom-left" }}
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
              defaultOpen: true,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
              defaultOpen: false,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
