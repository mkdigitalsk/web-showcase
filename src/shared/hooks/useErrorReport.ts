import { useEffect } from 'react'
import { isRouteErrorResponse } from 'react-router'
import { allowsErrorRecording } from '../analytics/consent'
import { loadErrorTracking } from '../errorTracking/loadErrorTracking'
import { useConsent } from './useConsent'

/**
 * Hands the error a route's boundary caught to the error tracker, where the visitor allowed error recording — a
 * response a route threw on purpose is no failure.
 */
export function useErrorReport(error: unknown): void {
  const { state } = useConsent()
  const tracked = allowsErrorRecording(state)

  useEffect(() => {
    if (!tracked || isRouteErrorResponse(error)) return
    void loadErrorTracking().then((tracking) => tracking?.reportBrowserError(error))
  }, [error, tracked])
}
