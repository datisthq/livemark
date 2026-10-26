import { useMessages } from "../hooks/site.ts"
/** Renders a SoundCloud iframe embed */
export function SoundCloud(props: { url: string }) {
  const t = useMessages()
  const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(props.url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`

  return (
    <div className="not-prose my-4 overflow-hidden rounded-card border">
      <iframe
        className="w-full"
        height={166}
        src={src}
        title={t("media.soundcloud")}
        allow="autoplay"
      />
    </div>
  )
}
