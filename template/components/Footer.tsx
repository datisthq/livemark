import * as settings from "#settings.ts"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-center text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} {settings.TITLE}</span>
      </div>
    </footer>
  )
}
