import { describe, expect, it } from "vite-plus/test"
import { findPageNeighbours } from "./page-sequence.ts"

const sequence = ["/intro/", "/guide/", "/blog/post/"]

describe("findPageNeighbours", () => {
  it("should cross from one section's last page to the next section's first", () => {
    expect(findPageNeighbours({ sequence, path: "/guide/" })).toEqual({
      prev: "/intro/",
      next: "/blog/post/",
    })
  })

  it("should lead from the landing page to the first article and back", () => {
    expect(findPageNeighbours({ sequence, path: "/", landing: "/" })).toEqual({
      prev: undefined,
      next: "/intro/",
    })
    expect(findPageNeighbours({ sequence, path: "/intro/", landing: "/" })).toEqual({
      prev: "/",
      next: "/guide/",
    })
  })

  it("should not lead back from the first article without a landing page", () => {
    expect(findPageNeighbours({ sequence, path: "/intro/" }).prev).toBeUndefined()
  })

  it("should not list a landing page that is itself an article twice", () => {
    const home = ["/", ...sequence]
    expect(findPageNeighbours({ sequence: home, path: "/", landing: "/" })).toEqual({
      prev: undefined,
      next: "/intro/",
    })
  })

  it("should find nothing for a page outside the sequence", () => {
    expect(findPageNeighbours({ sequence, path: "/blog/", landing: "/" })).toEqual({})
  })
})
