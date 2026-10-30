import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useConsent } from '../hooks'
import { storedConsent } from '../services/consentCookies'
import { Routes } from '../../utils'
import { allowsMeasurement } from './consent'

/**
 * The pages measured — the ones a stranger reaches signed out. A signed-in page belongs to a named person, so it is
 * never measured — analytics.md § This template's shape ships none.
 */
const MEASURED_PAGES: ReadonlySet<string> = new Set([
  Routes.ROOT,
  Routes.SIGN_IN,
  Routes.SIGN_UP,
  Routes.PRIVACY,
  Routes.TERMS,
])

/**
 * An event as it is, or none:
 * - from a page that is not measured
 * - once the browser's cookies no longer allow measurement, as another tab may keep
 */
function measuredWhileAllowed<Sent extends { url: string }>(event: Sent): Sent | null {
  const measured = MEASURED_PAGES.has(new URL(event.url).pathname)
  return measured && allowsMeasurement(storedConsent()) ? event : null
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
