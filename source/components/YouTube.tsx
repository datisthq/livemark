import { useMessages } from "../hooks/site.ts"
/** Renders a responsive YouTube iframe embed */
export function YouTube(props: { id: string }) {
  const t = useMessages()
  return (
    <div className="not-prose my-4 overflow-hidden rounded-card border">
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${props.id}`}
          title={t("media.youtube")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
