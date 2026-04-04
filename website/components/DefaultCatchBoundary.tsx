import type { ErrorComponentProps } from "@tanstack/react-router"
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router"

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: state => state.id === rootRouteId,
  })

  console.error(error)

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
      <ErrorComponent error={error} />
      <div className="flex gap-3 items-center flex-wrap">
        <button
          type="button"
          onClick={() => {
            router.invalidate()
          }}
          className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className="border border-border px-4 py-2 text-sm font-medium hover:bg-card transition-colors"
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className="border border-border px-4 py-2 text-sm font-medium hover:bg-card transition-colors"
            onClick={(e: any) => {
              e.preventDefault()
              window.history.back()
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  )
}
