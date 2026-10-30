import * as Sentry from '@sentry/browser'
import type { ErrorEvent } from '@sentry/browser'
import { allowsErrorRecording } from '../analytics/consent'
import { storedConsent } from '../services/consentCookies'
import { pageEvent } from './trackerEvent'
import type { TrackerSettings } from './trackerSettings'

/**
 * The SDK's own integrations that catch a failure and say where it happened — the rest record the visit around it:
 * - the trail of clicks, console lines and requests before the error
 * - the visit as a session
 * - the visitor's locale and time zone
 * - the AI conversation a traced call belongs to
 */
const FAILURE_INTEGRATIONS: ReadonlySet<string> = new Set([
  'EventFilters',
  'FunctionToString',
  'BrowserApiErrors',
  'GlobalHandlers',
  'LinkedErrors',
  'Dedupe',
  'HttpContext',
])

/** What the SDK would gather in the browser on its own, held to the failure itself. */
const FAILURES_ONLY = {
  /**
   * Nothing about the visitor but the browser's user agent is collected, and the tracker infers no IP address from the
   * request it receives.
   */
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: { request: { allow: ['User-Agent'] }, response: false },
    httpBodies: [],
    urlQueryParams: false,
    frameContextLines: 0,
  },
  integrations: (defaults) => defaults.filter(({ name }) => FAILURE_INTEGRATIONS.has(name)),
  /** No count of the errors it drops — a count sent after another tab's refusal still says an error happened. */
  sendClientReports: false,
} satisfies Sentry.BrowserOptions

/**
 * An error as {@link pageEvent} cuts it, while the browser's cookies allow error recording.
 * None once they no longer do, as another tab may keep.
 */
function recordedWhileAllowed(event: ErrorEvent): ErrorEvent | null {
  return allowsErrorRecording(storedConsent()) ? pageEvent(event) : null
}

/**
 * Sends each error a page throws and no code catches to the project the DSN names, under the deployment's
 * environment, as {@link recordedWhileAllowed} hands it over — no replay of the visitor's screen and no tracing. A
 * second call keeps the client the first one started.
 */
export function startBrowserErrorTracking({ dsn, environment }: TrackerSettings): void {
  if (Sentry.isInitialized()) return
  Sentry.init({ dsn, environment, ...FAILURES_ONLY, beforeSend: recordedWhileAllowed })
}

/** Sends an error a route's boundary caught — the router hands it to the boundary, never to the window's handler. */
export function reportBrowserError(error: unknown): void {
  Sentry.captureException(error)
}
