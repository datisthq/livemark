import { describe, expect, it } from "vite-plus/test"
import { parseYoutubeId } from "./youtube-id.ts"

describe("parseYoutubeId", () => {
  it.each([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/watch?feature=share&v=dQw4w9WgXcQ&t=42s",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?si=abc",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    "https://www.youtube.com/live/dQw4w9WgXcQ?feature=shared",
  ])("derives the id from %s", url => {
    expect(parseYoutubeId(url)).toBe("dQw4w9WgXcQ")
  })

  it.each([
    "dQw4w9WgXcQ",
    "https://vimeo.com/123456789",
    "https://www.youtube.com/watch",
    "https://www.youtube.com/@channel",
    "https://www.youtube.com/watch?v=short",
  ])("returns undefined for %s", url => {
    expect(parseYoutubeId(url)).toBeUndefined()
  })
})
