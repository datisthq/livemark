import { Link } from "@tanstack/react-router"
import { buttonVariants } from "../elements/button.tsx"

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-sans text-6xl font-semibold mb-4">404</h1>
      <div className="text-muted-foreground mb-6">
        {children || <p>The page you're looking for doesn't exist.</p>}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className={buttonVariants({ size: "lg" })}
        >
          Go Back
        </button>
        <Link to="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Home
        </Link>
      </div>
    </div>
  )
}
