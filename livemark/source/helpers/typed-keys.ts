/** Hold what the reader types until `release()`, so a query typed while a lazily
 *  loaded search field mounts neither fires the page's one-key shortcuts nor gets
 *  lost. Keys with a modifier, and keys typed into a field, pass through; holding
 *  stops on release or after 5 s. */
export function holdTypedKeys(target: EventTarget = window) {
  let typed = ""
  let active = true
  const onKeyDown = (event: Event) => {
    const key = event as KeyboardEvent
    if (key.ctrlKey || key.metaKey || key.altKey || isEditable(event.target)) return
    if (key.key === "Backspace") typed = typed.slice(0, -1)
    else if (key.key.length === 1) typed += key.key
    else return
    event.preventDefault()
    event.stopImmediatePropagation()
  }
  // Capture, so the shortcut listeners on `document` never see the held keys
  target.addEventListener("keydown", onKeyDown, { capture: true })
  const timer = setTimeout(() => release(), 5000)

  function release() {
    if (!active) return ""
    active = false
    clearTimeout(timer)
    target.removeEventListener("keydown", onKeyDown, { capture: true })
    return typed
  }
  return { release }
}

function isEditable(target: EventTarget | null) {
  if (!target || !("tagName" in target)) return false
  const element = target as HTMLElement
  return element.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(element.tagName)
}
