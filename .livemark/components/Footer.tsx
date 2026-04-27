/** Footer shown below article content */
export function Footer() {
  return (
    <p className="mt-12 text-center text-sm text-muted-foreground">
      Built with <span className="text-red-500">❤</span> and{" "}
      <a
        href="https://livemark.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium hover:text-foreground transition-colors"
      >
        Livemark
      </a>
    </p>
  )
}
