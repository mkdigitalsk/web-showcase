import * as Sentry from '@sentry/browser'
import { trackerSettingsOf, type TrackerSettings } from '../shared/errorTracking/trackerSettings'
import { TRACKER_DSN } from './trackerEnvelopes'

const FLUSH_MS = 5_000

/** The settings a production build inlines once its environment names the tracker. */
function builtFor(environment: Readonly<Record<string, string>>): TrackerSettings {
  const settings = trackerSettingsOf(environment)
  if (settings === undefined) throw new Error('the environment names no tracker')
  return settings
}

export const BUILT_TRACKER = builtFor({ SENTRY_DSN: TRACKER_DSN, VERCEL_ENV: 'production' })

/**
 * [error] as a page throws it and no code catches it, handed to the window's `onerror` as the browser hands it —
 * dispatched as an event instead, it reaches the test runner's own listener and fails the run.
 */
export function thrownOnThePage(error: Error): void {
  window.onerror?.(error.message, window.location.href, 1, 1, error)
}

/** Waits until the browser's SDK has posted every event it holds. */
export async function allSentToTheTracker(): Promise<void> {
  await Sentry.flush(FLUSH_MS)
  await Sentry.close()
}

/** The SDK keeps its client page-wide, and `init` keeps the first one it finds — so each test starts with none. */
export function forgetTheClient(): void {
  Sentry.getCurrentScope().setClient(undefined)
}
