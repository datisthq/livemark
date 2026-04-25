/** Renders pre-formatted HTML produced from ANSI escape sequences */
export function AnsiCode(props: { html: string }) {
  return (
    <figure className="shiki not-prose my-4 relative rounded-xl border shadow-sm overflow-hidden text-sm bg-sidebar dark:bg-sidebar">
      <div className="text-[0.8125rem] py-3.5 overflow-auto">
        <pre className="min-w-full w-max">
          <code
            className="flex flex-col"
            dangerouslySetInnerHTML={{ __html: props.html }}
          />
        </pre>
      </div>
    </figure>
  )
}
