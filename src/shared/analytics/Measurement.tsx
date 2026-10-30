import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useConsent } from '../hooks'
import { storedConsent } from '../services/consentCookies'
import { allowsMeasurement } from './consent'

/**
 * An event as it is, while the browser's cookies allow measurement — none once they no longer do, as another tab may
 * keep.
 */
function measuredWhileAllowed<Sent>(event: Sent): Sent | null {
  return allowsMeasurement(storedConsent()) ? event : null
}

/** Vercel's measurement scripts, mounted only once the visitor allows them — analytics.md § Consent. */
export function Measurement() {
  const { state } = useConsent()
  if (!allowsMeasurement(state)) return null
  return (
    <>
      <Analytics beforeSend={measuredWhileAllowed} />
      <SpeedInsights beforeSend={measuredWhileAllowed} />
    </>
  )
}
