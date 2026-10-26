import { XIcon } from "lucide-react"
import { useRef, type ReactNode } from "react"
import { cn } from "cn"
import { Button } from "../elements/button.tsx"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../elements/drawer.tsx"
import { useMessages } from "../hooks/site.ts"

/** A phone's bottom sheet: title left, close right, a scrolling body and an
 * optional pinned footer. */
export function SheetPanel(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenChangeComplete?: (open: boolean) => void
  title: ReactNode
  footer?: ReactNode
  bodyClassName?: string
  children: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const t = useMessages()

  return (
    <Drawer
      open={props.open}
      onOpenChange={open => props.onOpenChange(open)}
      onOpenChangeComplete={props.onOpenChangeComplete}
    >
      <DrawerContent
        // The body, never its first link: focusing that scrolls the list to it
        // and paints a focus ring the tap never asked for.
        initialFocus={panelRef}
        showCloseButton={false}
        className="max-h-[85dvh] gap-0"
      >
        <DrawerHeader className="shrink-0 flex-row items-center gap-2 pb-2">
          <DrawerTitle className="line-clamp-1 text-lg font-semibold">
            {props.title}
          </DrawerTitle>
          <DrawerClose
            render={<Button variant="ghost" size="icon-sm" className="-mr-2 ml-auto" />}
          >
            <XIcon className="size-5" />
            <span className="sr-only">{t("nav.close")}</span>
          </DrawerClose>
        </DrawerHeader>
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 pt-2 text-base outline-none empty:hidden",
            props.footer ? "pb-2" : "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
            props.bodyClassName,
          )}
        >
          {props.children}
        </div>
        {props.footer && (
          <div className="shrink-0 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {props.footer}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
