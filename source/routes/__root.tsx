import { config } from "livemark:virtual"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type * as React from "react"
import { useEffect } from "react"
import { Layout } from "../components/Layout.tsx"
import { Root } from "../components/Root.tsx"
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary.tsx"
import { NotFound } from "../components/NotFound.tsx"
import { useHydrated } from "../hooks/hydrated.ts"
import { Toaster } from "../elements/sonner.tsx"
import { buildRootHead } from "../helpers/head.ts"
import { startTheme } from "../helpers/theme.ts"
import { customizeHead } from "../head.ts"
import defaultFavicon from "../assets/logo.svg"
import generalCss from "../styles/general.css?url"
import markdownCss from "../styles/markdown.css?url"

export const Route = createRootRoute({
  head: () =>
    customizeHead(
      buildRootHead({ config, defaultFavicon, stylesheets: [generalCss, markdownCss] }),
    ),
  notFoundComponent: () => (
    <Layout>
      <NotFound />
    </Layout>
  ),
  errorComponent: props => {
    return (
      <Document>
        <Layout>
          <DefaultCatchBoundary {...props} />
        </Layout>
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
  // Off the raw URL, not the router's parsed search: a route whose validateSearch
  // does not declare this key strips it.
  const hydrated = useHydrated()
  const devtools = hydrated && window.location.search.includes("tanstack-devtools")

  useEffect(startTheme, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Root>{props.children}</Root>
        <Toaster position="top-center" />
        {/* Gated here, not by the devtools' own `requireUrlFlag`: that setting seeds
            localStorage on a browser's first run and is read from there afterwards,
            so a browser that loaded the site before it was set keeps the trigger. */}
        {/* The build strips the devtools element alone; the fragment keeps
            `devtools && (<></>)` valid instead of the syntax error `&& ()`. */}
        {devtools && (
          <>
            <TanStackDevtools
              config={{ requireUrlFlag: true, position: "bottom-left" }}
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
          </>
        )}
        <Scripts />
      </body>
    </html>
  )
}
