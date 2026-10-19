import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../elements/sidebar.tsx"
import { BackToTop } from "./BackToTop.tsx"
import { Banner } from "./Banner.tsx"
import { Header } from "./Header.tsx"
import { Sidebar } from "./Sidebar.tsx"

/** Site chrome around a page: banner, header, sidebar and back-to-top */
export function Layout(props: { withSidebar?: boolean; children?: React.ReactNode }) {
  return (
    <>
      <Banner />
      <SidebarProvider
        key={props.withSidebar ? "sidebar" : "mini"}
        defaultOpen={!!props.withSidebar}
      >
        <SidebarShell withSidebar={props.withSidebar}>{props.children}</SidebarShell>
      </SidebarProvider>
    </>
  )
}

function SidebarShell(props: { withSidebar?: boolean; children?: React.ReactNode }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) return
    if ((event.target as HTMLElement).closest("a")) setOpenMobile(false)
  }
  return (
    <div style={{ display: "contents" }} onClick={onClick}>
      <Sidebar withSidebar={props.withSidebar} />
      <SidebarInset>
        <Header
          toggle={props.withSidebar && <SidebarTrigger />}
          menu={<SidebarTrigger />}
        />
        <main className="flex-1">{props.children}</main>
        <BackToTop />
      </SidebarInset>
    </div>
  )
}
