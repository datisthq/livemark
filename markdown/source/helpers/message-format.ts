/** A UI string with its `{name}` placeholders filled from `values`. */
export function formatMessage(message: string, values?: Record<string, string>) {
  if (!values) return message
  return message.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match)
}
