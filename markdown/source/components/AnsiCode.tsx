import { ansiToHtml } from "../helpers/ansi.ts"

/** Renders terminal output, coloring its ANSI escape sequences */
export function AnsiCode(props: { children: string }) {
  return (
    <figure className="shiki not-prose my-4 relative rounded-card border shadow-sm overflow-hidden text-sm bg-sidebar dark:bg-sidebar">
      <div className="text-[0.8125rem] py-3.5 overflow-auto">
        <pre className="min-w-full w-max">
          <code
            className="flex flex-col"
            dangerouslySetInnerHTML={{ __html: ansiToHtml(props.children) }}
          />
        </pre>
      </div>
    </figure>
  )
}
