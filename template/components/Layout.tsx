import { Link } from "@tanstack/react-router"
import { useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../elements/drawer.tsx"
import * as icons from "../icons.ts"
import * as settings from "../settings.ts"

export function Layout(props: { children?: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-10 flex h-16 items-center justify-between">
          <Link to="/" className="font-sans text-xl font-semibold tracking-tight">
            {settings.TITLE}
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              Home
            </Link>
          </nav>

          <Drawer direction="right" open={menuOpen} onOpenChange={setMenuOpen}>
            <DrawerTrigger className="md:hidden p-2 text-foreground">
              <icons.Menu
                className="size-5"
                strokeWidth={settings.ICON_STROKE_WIDTH}
              />
              <span className="sr-only">Menu</span>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex-row items-center justify-between border-b">
                <DrawerTitle className="text-lg font-semibold">
                  Menu
                </DrawerTitle>
                <DrawerClose className="p-1">
                  <icons.X
                    className="size-5"
                    strokeWidth={settings.ICON_STROKE_WIDTH}
                  />
                </DrawerClose>
              </DrawerHeader>
              <DrawerDescription className="sr-only">
                Navigation menu
              </DrawerDescription>
              <nav className="flex-1 overflow-y-auto flex flex-col p-3">
                <Link
                  to="/"
                  className="py-2 px-2 text-foreground hover:bg-card transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      <main className="flex-1">{props.children}</main>
    </div>
  )
}
