import { useCallback, useEffect, useRef, useState } from "react"

export function useInView() {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<Element | null>(null)

  const ref = useCallback((node: Element | null) => {
    elementRef.current = node
  }, [])

  useEffect(() => {
    const node = elementRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
