import { Link } from "@tanstack/react-router"
import { buttonVariants } from "../elements/button.tsx"
import { useMessages, useSite } from "../hooks/site.ts"

export function NotFound({ children }: { children?: any }) {
  const t = useMessages()
  const home = useSite().language.prefix.replace(/^\/|\/$/g, "")
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-sans text-6xl font-semibold mb-4">404</h1>
      <div className="text-muted-foreground mb-6">
        {children || <p>{t("error.notFound")}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className={buttonVariants({ size: "lg" })}
        >
          {t("error.goBack")}
        </button>
        <Link
          to={home ? "/$" : "/"}
          params={home ? { _splat: home } : {}}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t("error.home")}
        </Link>
      </div>
    </div>
  )
}
