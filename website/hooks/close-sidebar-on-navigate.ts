import { useLocation } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSidebar } from "../elements/sidebar.tsx"

/** Close the mobile sidebar sheet whenever the pathname changes. */
export function useCloseSidebarOnNavigate() {
  const { isMobile, setOpenMobile } = useSidebar()
  const pathname = useLocation({ select: l => l.pathname })
  useEffect(() => {
    if (isMobile) setOpenMobile(false)
  }, [pathname, isMobile, setOpenMobile])
}
