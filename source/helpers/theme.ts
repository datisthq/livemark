const STORAGE_KEY = "livemark-theme"
const DARK_QUERY = "(prefers-color-scheme: dark)"

export type Theme = "light" | "dark"
export type ThemePref = Theme | "system"

export function resolveTheme(pref: ThemePref, prefersDark: boolean): Theme {
  if (pref === "system") return prefersDark ? "dark" : "light"
  return pref
}

export function activateTheme(theme: Theme) {
  if (theme === "dark") {
    globalThis.document.documentElement.classList.add("dark")
  } else {
    globalThis.document.documentElement.classList.remove("dark")
  }
}

export function getCurrentTheme(): Theme {
  return globalThis.document?.documentElement.classList.contains("dark")
    ? "dark"
    : "light"
}

// Mirrors `buildThemeScript`: anything but an explicit light or dark follows the OS.
export function getThemePref(): ThemePref {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {}
  return stored === "light" || stored === "dark" ? stored : "system"
}

export function setTheme(pref: ThemePref) {
  applyThemePref(pref)
  try {
    localStorage.setItem(STORAGE_KEY, pref)
  } catch {}
}

// Returns the OS listener's cleanup, so an effect StrictMode runs twice keeps one.
export function startTheme() {
  const query = matchMedia(DARK_QUERY)
  const handleChange = () => {
    if (getThemePref() === "system") applyThemePref("system")
  }
  applyThemePref(getThemePref())
  query.addEventListener("change", handleChange)
  return () => query.removeEventListener("change", handleChange)
}

// The pre-paint twin of `startTheme`, inlined in <head> so a dark reader never sees
// the light palette flash before hydration.
export function buildThemeScript() {
  return `try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)})}catch(e){}if(t==="dark"||(t!=="light"&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches))document.documentElement.classList.add("dark");`
}

function applyThemePref(pref: ThemePref) {
  activateTheme(resolveTheme(pref, matchMedia(DARK_QUERY).matches))
}
