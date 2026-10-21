/** Run keyed async tasks one at a time; a key enqueued again before its task
 *  starts replaces it, so a burst of events for one file costs one run. */
export function createTaskQueue(props: { onError: (error: unknown) => void }) {
  const pending = new Map<string, () => Promise<unknown>>()
  let draining: Promise<void> | undefined

  return {
    enqueue(key: string, task: () => Promise<unknown>) {
      pending.set(key, task)
      draining ??= drain()
      return draining
    },
  }

  async function drain() {
    // A Map iterator also visits entries set during iteration, which is what
    // picks up keys enqueued while a task runs.
    for (const [key, task] of pending) {
      pending.delete(key)
      try {
        await task()
      } catch (error) {
        props.onError(error)
      }
    }
    draining = undefined
  }
}
