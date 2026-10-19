import type { ErrorComponentProps } from "@tanstack/react-router"
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router"
import { buttonVariants } from "../elements/button.tsx"

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
          className={buttonVariants({ size: "lg" })}
        >
          Try Again
        </button>
        {isRoot ? (
          <Link to="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
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
