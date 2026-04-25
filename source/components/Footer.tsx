/** Footer shown below article content */
export function Footer() {
  return (
    <p className="mt-12 text-center text-sm text-muted-foreground">
      Created with <span className="text-red-500">❤</span> and{" "}
      <a
        href="https://github.com/datisthq/livemark"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium hover:text-foreground transition-colors"
      >
        Livemark
      </a>
    </p>
  )
}
