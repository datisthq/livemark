import { sites } from "livemark:virtual"
import { useLocation } from "@tanstack/react-router"
import { useCallback } from "react"
import type { MessageKey } from "../models/message.ts"
import { formatMessage, matchSite } from "../helpers/site.ts"

/** The current page's language site: its config, UI strings and banner. */
export function useSite() {
  const pathname = useLocation({ select: l => l.pathname })
  return matchSite(pathname, sites)
}

/** A translator for the current page's language: `t("toc.title")`, with `{name}`
 *  placeholders filled from `values`. */
export function useMessages() {
  const messages = useSite().messages
  return useCallback(
    (key: MessageKey, values?: Record<string, string>) =>
      formatMessage(messages[key], values),
    [messages],
  )
}
