import { createContext, useContext } from "react"
import type { TocItem } from "../models/toc.ts"

/** React context that provides TOC items to inline components */
export const TocContext = createContext<TocItem[]>([])

/** Consume the TOC items from the nearest TocContext provider */
export function useTocItems() {
  return useContext(TocContext)
}
