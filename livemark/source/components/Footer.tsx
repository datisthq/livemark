import { Fragment } from "react"
import { useMessages } from "../hooks/site.ts"

/** Footer shown below article content */
export function Footer() {
  const t = useMessages()
  // Split on the placeholders so the heart and the link stay elements in any word order.
  const parts = t("footer.createdWith").split(/(\{heart\}|\{livemark\})/)
  return (
    <p className="mt-12 text-center text-sm text-muted-foreground">
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part === "{heart}" ? (
            <span className="text-red-500">❤</span>
          ) : part === "{livemark}" ? (
            <a
              href="https://livemark.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              Livemark
            </a>
          ) : (
            part
          )}
        </Fragment>
      ))}
    </p>
  )
}
