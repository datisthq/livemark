import { Link, useLocation } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Clock, List, Rss, Tag } from "lucide-react"
import {
  currentSection,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "../elements/sidebar.tsx"
import { Search } from "./Search.tsx"
import { SidebarLinks } from "./SidebarLinks.tsx"
import { SiteTitle } from "./SiteTitle.tsx"
import { Theme } from "./Theme.tsx"

/** Blog-specific sidebar with Posts, Tags, and Links */
export function BlogSidebar() {
  const pathname = useLocation({ select: l => l.pathname })
  const { toggleSidebar } = useSidebar()

  useHotkey("S", toggleSidebar)

  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const flat = section ? (sectionFlatArticles.get(section.pathname) ?? []) : []
  const posts = flat
    .map(p => sortedArticles.find(a => a.path === p))
    .filter(a => a !== undefined)
  const recentPosts = posts.slice(0, 5)

  const allTags = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      allTags.add(tag)
    }
  }
  const tags = [...allTags].sort()

  const normalized = `/${pathname.replace(/^\/|\/$/g, "")}/`
  const isIndex = section ? normalized === section.pathname : false
  const sectionPath = (section?.pathname ?? "/blog/").replace(/^\/|\/$/g, "")

  return (
    <SidebarRoot>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <SiteTitle />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
            Posts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isIndex}
                  className={isIndex ? "" : "opacity-75"}
                  render={<Link to="/$" params={{ _splat: sectionPath }} />}
                >
                  <List className="size-4" />
                  <span>All Posts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="opacity-75">
                  <Clock className="size-4" />
                  <span>Recent Posts</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {recentPosts.map(post => {
                    const active = normalized === post.path
                    return (
                      <SidebarMenuSubItem key={post.path}>
                        <SidebarMenuSubButton
                          isActive={active}
                          className={active ? "" : "opacity-75"}
                          render={
                            <Link
                              to="/$"
                              params={{
                                _splat: post.path.replace(/^\/|\/$/g, ""),
                              }}
                            />
                          }
                        >
                          <span>{post.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="opacity-75">
                  <Rss className="size-4" />
                  <span>RSS Feed</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {tags.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase font-mono text-xs tracking-widest">
              Tags
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tags.map(tag => {
                  const tagPath = `${sectionPath}/tags/${tag}`
                  const tagActive = normalized === `/${tagPath}/`
                  return (
                    <SidebarMenuItem key={tag}>
                      <SidebarMenuButton
                        isActive={tagActive}
                        className={tagActive ? "" : "opacity-75"}
                        render={<Link to="/$" params={{ _splat: tagPath }} />}
                      >
                        <Tag className="size-3.5" />
                        <span>{tag}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarLinks />
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <Search />
        <Theme />
      </SidebarFooter>
      <SidebarRail />
    </SidebarRoot>
  )
}
