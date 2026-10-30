import { useEffect } from 'react'
import { loadErrorTracking } from '../errorTracking/loadErrorTracking'
import { useConsent } from '../hooks'
import { allowsErrorRecording } from './consent'

/**
 * Records the errors a page throws in the visitor's browser, started only once the visitor allows it in the bar — an
 * answer of its own, beside the one that loads Vercel's measurement. A withdrawal reloads the page, which unloads
 * the SDK.
 */
export function ErrorTracking() {
  const { state } = useConsent()
  const allowed = allowsErrorRecording(state)

  useEffect(() => {
    if (allowed) void loadErrorTracking()
  }, [allowed])

  return null
}
