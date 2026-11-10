import { createContext, createElement, useCallback, useContext } from "react"
import type { ReactNode } from "react"
import { formatMessage } from "../helpers/message-format.ts"
import { useSiteMessages } from "../helpers/site-messages.ts"
import type { MessageKey, Messages } from "../models/message.ts"

const MessagesContext = createContext<Partial<Messages> | undefined>(undefined)

/** Supplies UI strings to Livemark components rendered outside a Livemark site; a key
 *  left out keeps its English default. */
export function MessagesProvider(props: {
  messages: Partial<Messages>
  children?: ReactNode
}) {
  return createElement(MessagesContext, { value: props.messages }, props.children)
}

/** A translator for Livemark's UI strings: `t("toc.title")`, with `{name}` placeholders
 *  filled from `values`. A `MessagesProvider` wins over the site's language. */
export function useMessages() {
  const provided = useContext(MessagesContext)
  const site = useSiteMessages()
  return useCallback(
    (key: MessageKey, values?: Record<string, string>) =>
      formatMessage(provided?.[key] ?? site[key], values),
    [provided, site],
  )
}
