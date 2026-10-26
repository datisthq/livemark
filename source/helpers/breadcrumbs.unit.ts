import { describe, expect, it } from "vite-plus/test"
import { buildBreadcrumbs } from "./breadcrumbs.ts"

describe("buildBreadcrumbs", () => {
  const pages = new Map([
    ["/api/", { title: "API", path: "/api/" }],
    ["/es/api/", { title: "API ES", path: "/es/api/" }],
  ])
  const findCrumb = (folder: string) => pages.get(folder)

  it("should name each folder by its page or its segment", () => {
    expect(buildBreadcrumbs("/api/v1/auth/", "/", findCrumb)).toEqual([
      { title: "API", path: "/api/" },
      { title: "v1" },
    ])
  })

  it("should list no folders for a top-level article", () => {
    expect(buildBreadcrumbs("/intro/", "/", findCrumb)).toEqual([])
  })

  it("should skip the home page", () => {
    expect(buildBreadcrumbs("/", "/", findCrumb)).toBeUndefined()
    expect(buildBreadcrumbs("/es/", "/es/", findCrumb)).toBeUndefined()
  })

  it("should count folders from the language's home", () => {
    expect(buildBreadcrumbs("/es/api/auth/", "/es/", findCrumb)).toEqual([
      { title: "API ES", path: "/es/api/" },
    ])
  })
})
