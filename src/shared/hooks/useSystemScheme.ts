import { useSyncExternalStore } from 'react'
import type { ColorScheme } from '../context/ColorSchemeContext'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const canQuery = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

function subscribe(onChange: () => void) {
  if (!canQuery()) return () => undefined
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const read = (): ColorScheme | undefined => {
  if (!canQuery()) return undefined
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

const unknown = () => undefined

/** The scheme the device prefers, live — undefined where the browser cannot say, as under a test runner. */
export function useSystemScheme(): ColorScheme | undefined {
  return useSyncExternalStore(subscribe, read, unknown)
}
