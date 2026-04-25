import { Check, Clipboard } from "lucide-react"
import { useState } from "react"

type Manager = "npm" | "pnpm" | "yarn" | "bun"

const managers: Manager[] = ["npm", "pnpm", "yarn", "bun"]

interface PackageTabsProps {
  npm: string
  pnpm: string
  yarn: string
  bun: string
}

/** Tabbed code block showing a command for each package manager */
export function PackageTabs(props: PackageTabsProps) {
  const [active, setActive] = useState<Manager>("npm")
  const [copied, setCopied] = useState(false)

  const commands: Record<Manager, string> = {
    npm: props.npm,
    pnpm: props.pnpm,
    yarn: props.yarn,
    bun: props.bun,
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[active])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <figure className="not-prose my-4 relative rounded-xl border shadow-sm overflow-hidden text-sm bg-sidebar dark:bg-sidebar">
      <div className="flex items-center border-b">
        <div className="flex flex-1 items-center">
          {managers.map(pm => (
            <button
              key={pm}
              type="button"
              onClick={() => setActive(pm)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                pm === active
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="me-2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Clipboard className="size-3.5" />
          )}
        </button>
      </div>
      <div className="text-[0.8125rem] py-3.5 overflow-auto max-h-[600px]">
        <pre className="min-w-full w-max">
          <code className="flex flex-col">
            <span className="px-4">{commands[active]}</span>
          </code>
        </pre>
      </div>
    </figure>
  )
}
