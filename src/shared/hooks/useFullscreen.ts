import { useSyncExternalStore } from 'react'

export type FullscreenOutcome = 'switched' | 'refused'

/** The browser leaves fullscreen on its own — Esc, a tab switch — and says so only through this event. */
function subscribe(onChange: () => void) {
  document.addEventListener('fullscreenchange', onChange)
  return () => document.removeEventListener('fullscreenchange', onChange)
}

const read = () => Boolean(document.fullscreenElement)

const windowed = () => false

/**
 * The browser rejects a switch it will not make — no user activation, a permissions policy against it.
 * [MDN — Element.requestFullscreen(), exceptions](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen#exceptions)
 */
async function attempt(switchMode: () => Promise<void>): Promise<FullscreenOutcome> {
  try {
    await switchMode()
    return 'switched'
  } catch {
    return 'refused'
  }
}

/**
 * Whether the page is in fullscreen, live, and the switch between the two. A document that may not go fullscreen —
 * Safari on an iPhone, a frame without `allowfullscreen` — says so through `fullscreenEnabled`.
 * [MDN — Document.fullscreenEnabled](https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenEnabled)
 */
export function useFullscreen() {
  const isSupported = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)
  const isFullscreen = useSyncExternalStore(subscribe, read, windowed)

  const toggle = () =>
    attempt(() => (isFullscreen ? document.exitFullscreen() : document.documentElement.requestFullscreen()))

  return { isSupported, isFullscreen, toggle }
}
