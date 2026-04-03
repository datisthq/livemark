import { TanStackDevtools } from "@tanstack/react-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type * as React from "react"
import { Layout } from "../components/Layout.tsx"
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary.tsx"
import { NotFound } from "../components/NotFound.tsx"
import { Toaster } from "../elements/sonner.tsx"
import * as settings from "../settings.ts"
import generalCss from "../styles/general.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: settings.TITLE },
      { name: "description", content: settings.DESCRIPTION },
      { property: "og:title", content: settings.TITLE },
      { property: "og:description", content: settings.DESCRIPTION },
      { property: "og:site_name", content: settings.TITLE },
      { property: "og:type", content: "website" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      { rel: "stylesheet", href: generalCss },
      { rel: "canonical", href: settings.HOST },
    ],
  }),
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
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <Layout>{props.children}</Layout>
        <Toaster position="top-center" />
        <TanStackDevtools
          config={{ hideUntilHover: true }}
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
