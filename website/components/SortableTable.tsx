import { useEffect, useRef, type ComponentProps } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../elements/table.tsx"

/** Wraps markdown tables with click-to-sort column headers */
export function SortableTable(props: ComponentProps<"table">) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    let activeCol = -1
    let ascending = true

    const headers = container.querySelectorAll<HTMLElement>("th")
    const cleanups: (() => void)[] = []

    headers.forEach((th, colIndex) => {
      th.style.cursor = "pointer"
      th.classList.add("select-none")

      const handler = () => {
        if (activeCol === colIndex) {
          ascending = !ascending
        } else {
          activeCol = colIndex
          ascending = true
        }

        const tbody = container.querySelector("tbody")
        if (!tbody) return

        const rows = Array.from(tbody.querySelectorAll("tr"))
        rows.sort((a, b) => {
          const aVal = a.children[colIndex]?.textContent?.trim() ?? ""
          const bVal = b.children[colIndex]?.textContent?.trim() ?? ""
          const aNum = Number(aVal)
          const bNum = Number(bVal)
          const cmp =
            aVal !== "" && bVal !== "" && !isNaN(aNum) && !isNaN(bNum)
              ? aNum - bNum
              : aVal.localeCompare(bVal)
          return ascending ? cmp : -cmp
        })
        for (const row of rows) tbody.appendChild(row)

        headers.forEach((h, i) => {
          const indicator = h.querySelector("[data-sort]")
          if (indicator) indicator.remove()
          if (i === colIndex) {
            const span = document.createElement("span")
            span.dataset.sort = ""
            span.className = "ml-1 text-muted-foreground"
            span.textContent = ascending ? "↑" : "↓"
            h.appendChild(span)
          }
        })
      }

      th.addEventListener("click", handler)
      cleanups.push(() => th.removeEventListener("click", handler))
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <div ref={ref} className="not-prose">
      <Table {...props} />
    </div>
  )
}

export { TableHeader, TableBody, TableRow, TableHead, TableCell }
