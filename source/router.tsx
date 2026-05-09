import { config } from "livemark:virtual"
import { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary.tsx"
import { NotFound } from "./components/NotFound.tsx"
import { routeTree } from "./routeTree.gen.ts"

export function getRouter() {
  const queryClient = new QueryClient()

  const router = createRouter({
    routeTree,
    basepath: config.base,
    context: { queryClient },
    trailingSlash: "always",
    defaultPreload: "intent",
    defaultViewTransition: true,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
