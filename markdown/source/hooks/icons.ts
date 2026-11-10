import { createContext, createElement, useContext } from "react"
import type { ComponentType, ReactNode } from "react"

/** Lucide icons by their key in Lucide's `icons` map, such as `ArrowRight`. */
export type IconMap = Record<string, ComponentType<{ className?: string }> | undefined>

const IconsContext = createContext<IconMap>({})

/** Supplies the icons `:icon` and `::card{icon}` render outside a Livemark site, such
 *  as lucide-react's `icons` or a subset of it. */
export function IconsProvider(props: { icons: IconMap; children?: ReactNode }) {
  return createElement(IconsContext, { value: props.icons }, props.children)
}

/** The icons an `IconsProvider` supplies; none without one. */
export function useIcons() {
  return useContext(IconsContext)
}
