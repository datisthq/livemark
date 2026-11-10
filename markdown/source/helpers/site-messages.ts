import { Messages } from "../models/message.ts"

const DEFAULT_MESSAGES = Messages.parse({})

/** The UI strings outside a Livemark site: English. */
export function useSiteMessages() {
  return DEFAULT_MESSAGES
}
