import { parseYoutubeId } from "../helpers/youtube-id.ts"
import { useMessages } from "../hooks/site.ts"
/** Renders a responsive YouTube iframe embed */
export function Video(props: { url: string }) {
  const t = useMessages()
  const id = parseYoutubeId(props.url)
  if (!id) {
    return (
      <p>
        <a href={props.url}>{props.url}</a>
      </p>
    )
  }

  return (
    <div className="not-prose my-4 overflow-hidden rounded-card border">
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={t("media.youtube")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
