import { CheckIcon } from "lucide-react"
import { cloneElement, useState, type ReactElement, type ReactNode } from "react"
import { cn } from "cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../elements/dropdown-menu.tsx"
import { useIsMobile } from "../hooks/media.ts"
import { SheetPanel } from "./SheetPanel.tsx"

/** One row of a `MenuSheet` */
export type MenuSheetItem = {
  id: string
  label: ReactNode
  icon?: ReactNode
  active?: boolean
  onSelect?: () => void
}

/** A menu that is an anchored dropdown from a laptop up and a bottom sheet on a
 * phone */
export function MenuSheet(props: {
  trigger: ReactElement<{ onClick?: () => void; children?: ReactNode }>
  children?: ReactNode
  title: ReactNode
  items: MenuSheetItem[]
  align?: "start" | "end"
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const changeOpen = (next: boolean) => {
    setOpen(next)
    props.onOpenChange?.(next)
  }

  if (isMobile) {
    return (
      <>
        {cloneElement(props.trigger, { onClick: () => changeOpen(true) }, props.children)}
        <SheetPanel open={open} onOpenChange={changeOpen} title={props.title}>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            {props.items.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  className={cn(ROW, item.active && ROW_ACTIVE)}
                  onClick={() => {
                    item.onSelect?.()
                    changeOpen(false)
                  }}
                >
                  {item.icon}
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.active && <CheckIcon className="size-4 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </SheetPanel>
      </>
    )
  }

  return (
    <DropdownMenu onOpenChange={props.onOpenChange}>
      {/* Without a `render`, Base UI's trigger falls back to a bare <button> — which
          SSR paints on a phone until `useIsMobile` flips, flashing a stray icon. */}
      <DropdownMenuTrigger render={props.trigger}>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent align={props.align ?? "end"}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{props.title}</DropdownMenuLabel>
          {props.items.map(item => (
            <DropdownMenuItem
              key={item.id}
              onClick={item.onSelect}
              className="cursor-pointer gap-2"
            >
              {item.icon}
              <span className={item.active ? "font-medium" : undefined}>
                {item.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ROW =
  "hover:bg-muted active:bg-muted flex h-10 w-full items-center gap-2.5 overflow-hidden rounded-md p-2 text-left text-base outline-hidden [&_svg]:size-[18px] [&_svg]:shrink-0"

const ROW_ACTIVE =
  "bg-sidebar-accent text-sidebar-accent-foreground font-semibold [&_svg]:stroke-[2.5]"
