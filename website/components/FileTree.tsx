import { File, Folder } from "lucide-react"

interface TreeItem {
  name: string
  isDir: boolean
  children?: TreeItem[]
}

/** Renders a file/directory tree from a JSON-serialized tree structure */
export function FileTree(props: { tree: string }) {
  const items: TreeItem[] = JSON.parse(props.tree)

  return (
    <div className="not-prose my-4 rounded-xl border border-border bg-card p-4 font-mono text-sm">
      <TreeItems items={items} depth={0} />
    </div>
  )
}

function TreeItems(props: { items: TreeItem[]; depth: number }) {
  return (
    <ul className={props.depth > 0 ? "ml-4 border-l border-border pl-2" : ""}>
      {props.items.map((item, index) => (
        <TreeNode
          key={`${item.name}-${index}`}
          item={item}
          depth={props.depth}
        />
      ))}
    </ul>
  )
}

function TreeNode(props: { item: TreeItem; depth: number }) {
  const { item, depth } = props

  return (
    <li className="py-0.5">
      <span className="inline-flex items-center gap-2">
        {item.isDir ? (
          <Folder className="size-4 shrink-0 text-primary" />
        ) : (
          <File className="size-4 shrink-0 text-muted-foreground" />
        )}
        <span className={item.isDir ? "font-semibold" : ""}>{item.name}</span>
      </span>
      {item.children && item.children.length > 0 && (
        <TreeItems items={item.children} depth={depth + 1} />
      )}
    </li>
  )
}
