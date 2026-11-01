const VIDEO_ID = /^[\w-]{11}$/
const PATH_PREFIXES = ["embed", "shorts", "live", "v"]

/** Derives the video id from a YouTube watch, youtu.be, embed, shorts or live URL */
export function parseYoutubeId(url: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return undefined
  }

  const host = parsed.hostname.replace(/^(www|m|music)\./, "")
  const segments = parsed.pathname.split("/").filter(Boolean)
  let id: string | null | undefined
  if (host === "youtu.be") id = segments[0]
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (segments[0] === "watch") id = parsed.searchParams.get("v")
    else if (PATH_PREFIXES.includes(segments[0] ?? "")) id = segments[1]
  }

  return id && VIDEO_ID.test(id) ? id : undefined
}
