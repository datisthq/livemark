import { createFileRoute } from "@tanstack/react-router"
import { respondWithFeed } from "../content/feed.ts"

export const Route = createFileRoute("/$language/$section/rss.xml")({
  server: {
    handlers: {
      GET: async ({ params }: { params: { language: string; section: string } }) =>
        respondWithFeed(`/${params.language}/${params.section}/`),
    },
  },
})
