const STORAGE_KEY = "livemark-theme"

export type Theme = "light" | "dark"

export function detectClientTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  return stored || "light"
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

export function setTheme(theme: Theme) {
  activateTheme(theme)
  localStorage.setItem(STORAGE_KEY, theme)
}
