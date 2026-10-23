export type ClipboardOutcome =
  { kind: 'copied' } | { kind: 'pasted'; text: string } | { kind: 'refused' } | { kind: 'unsupported' }

/**
 * A browser with the async Clipboard API still rejects a call it will not allow — a permission denied, a page
 * without focus.
 * [MDN — Clipboard.readText(), exceptions](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText#exceptions)
 */
async function attempt(operation: (clipboard: Clipboard) => Promise<ClipboardOutcome>): Promise<ClipboardOutcome> {
  if (!navigator.clipboard) return { kind: 'unsupported' }
  try {
    return await operation(navigator.clipboard)
  } catch {
    return { kind: 'refused' }
  }
}

export function useClipboard() {
  const copy = (text: string) =>
    attempt(async (clipboard) => {
      await clipboard.writeText(text)
      return { kind: 'copied' }
    })

  const paste = () => attempt(async (clipboard) => ({ kind: 'pasted', text: await clipboard.readText() }))

  return { copy, paste }
}
