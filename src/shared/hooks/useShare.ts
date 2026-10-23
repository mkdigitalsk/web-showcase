export type ShareOutcome = 'shared' | 'dismissed' | 'failed' | 'unsupported'

/**
 * The sheet rejects with `AbortError` when the person dismisses it, which is their choice and no failure. Any other
 * rejection — no user activation, data the sheet refuses — is one.
 * [MDN — Navigator.share(), exceptions](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#exceptions)
 */
async function share(data: ShareData): Promise<ShareOutcome> {
  try {
    await navigator.share(data)
    return 'shared'
  } catch (error) {
    return error instanceof DOMException && error.name === 'AbortError' ? 'dismissed' : 'failed'
  }
}

/** Offers the page the person is on to the device's share sheet. */
export function useShare() {
  const isSupported = typeof navigator !== 'undefined' && 'share' in navigator

  const sharePage = (title: string, text: string): Promise<ShareOutcome> =>
    isSupported ? share({ title, text, url: window.location.href }) : Promise.resolve('unsupported')

  return { isSupported, sharePage }
}
