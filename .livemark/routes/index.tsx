import { createFileRoute } from "@tanstack/react-router"

/**
 * Landing page at `/`. Customize this file to build your homepage.
 *
 * This file is authored in `.livemark/routes/` (project-root-relative)
 * and served via livemark's virtual routes mechanism — it follows the
 * same TanStack Router file-based conventions as `website/routes/`.
 *
 * Note: defining a route here at `/` takes precedence over livemark's
 * default splat-route behaviour (which otherwise renders the article at
 * `/` or redirects to the first article). Remove this file to restore it.
 */
export const Route = createFileRoute("/")({
  component: Landing,
})

function Landing() {
  return (
    <div className="flex flex-1 p-6 md:p-10">
      <div className="flex-1 min-w-0 mx-auto max-w-3xl">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Welcome</h1>
          <p>
            This is a placeholder landing page. Edit{" "}
            <code>.livemark/routes/index.tsx</code> to customize it.
          </p>
        </div>
      </div>
    </div>
  )
}
