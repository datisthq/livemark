import { Link } from "@tanstack/react-router"

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
          className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="border border-border px-4 py-2 text-sm font-medium hover:bg-card transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
