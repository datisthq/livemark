import { sites } from "livemark:virtual"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { Languages } from "lucide-react"
import { translatePath } from "../content/article.ts"
import { Button } from "../elements/button.tsx"
import { useMessages, useSite } from "../hooks/site.ts"
import { MenuSheet } from "./MenuSheet.tsx"

/** Header menu switching to the same page in another language, or to that
 *  language's home when the page has no translation. Hidden on a one-language site. */
export function LanguagePicker() {
  const pathname = useLocation({ select: l => l.pathname })
  const navigate = useNavigate()
  const current = useSite()
  const t = useMessages()

  if (sites.length < 2) return null

  return (
    <MenuSheet
      title={t("language.choose")}
      items={sites.map(site => ({
        id: site.language.code,
        label: site.language.label,
        active: site.language.code === current.language.code,
        onSelect: () => navigate({ to: translatePath(pathname, site) }),
      }))}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          title={t("language.choose")}
          aria-label={t("language.choose")}
          className="cursor-pointer text-muted-foreground"
        />
      }
    >
      <Languages className="size-4" />
    </MenuSheet>
  )
}
