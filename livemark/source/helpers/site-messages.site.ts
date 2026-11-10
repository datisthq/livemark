import { useSite } from "../hooks/site.ts"

/** The UI strings of the current page's language site. */
export function useSiteMessages() {
  return useSite().messages
}
