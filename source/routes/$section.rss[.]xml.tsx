import { createFileRoute } from "@tanstack/react-router"
import { respondWithFeed } from "../content/feed.ts"

export const Route = createFileRoute("/$section/rss.xml")({
  server: {
    handlers: {
      GET: async ({ params }: { params: { section: string } }) =>
        respondWithFeed(`/${params.section}/`),
    },
  },
})
