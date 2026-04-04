import { cn } from "../helpers/style.ts"
import { useInView } from "../hooks/in-view.ts"

export function Section(props: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const { ref, isVisible } = useInView()

  return (
    <section
      ref={ref}
      id={props.id}
      className={cn(
        "py-16 md:py-24 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        props.className,
      )}
    >
      {props.children}
    </section>
  )
}
