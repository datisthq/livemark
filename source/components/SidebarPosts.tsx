import { config } from "livemark:virtual"
import { Link, useLocation } from "@tanstack/react-router"
import { Clock, List, Rss, Tag } from "lucide-react"
import {
  currentSection,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../elements/sidebar.tsx"

/** Blog body slot for the Sidebar shell: All Posts / Recent Posts / RSS / Tags */
export function SidebarPosts() {
  const pathname = useLocation({ select: l => l.pathname })

  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const flat = section ? (sectionFlatArticles.get(section.prefix) ?? []) : []
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
  const isIndex = section ? normalized === section.prefix : false
  const sectionPath = (section?.prefix ?? "/blog/").replace(/^\/|\/$/g, "")

  return (
    <>
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
            {config.site && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="opacity-75"
                  render={<a href={`/${sectionPath}/rss.xml`} />}
                >
                  <Rss className="size-4" />
                  <span>RSS Feed</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
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
    </>
  )
}
