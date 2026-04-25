import { useSyncExternalStore } from "react"

export const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Synchronous, render-cycle-independent check.
 *  Use at event-handler call sites where React state may be momentarily stale
 *  (e.g. right after a SidebarProvider key remount). */
export function isMobileNow() {
  if (typeof window === "undefined") return false
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
}

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}
