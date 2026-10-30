import type { NodeOptions } from '@sentry/node'
import { waitUntil } from '@vercel/functions'
import { serverEvent } from '../src/shared/errorTracking/trackerEvent.js'
import { trackerSettingsOf } from '../src/shared/errorTracking/trackerSettings.js'

/**
 * The SDK's own integrations that catch a failure and say where it happened — the rest record the server around it:
 * - the trail of console lines and requests before the error
 * - the process as a session
 * - the installed modules
 * - the source lines and the local variables around each frame
 */
const FAILURE_INTEGRATIONS: ReadonlySet<string> = new Set([
  'EventFilters',
  'FunctionToString',
  'LinkedErrors',
  'Dedupe',
  'Context',
])

/** What the SDK would gather or change on its own, held to the failure itself. */
const FAILURES_ONLY = {
  /** Nothing about a request or its visitor is collected, so nothing of them waits to be cut. */
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    stackFrameVariables: false,
    frameContextLines: 0,
  },
  integrations: (defaults) => defaults.filter(({ name }) => FAILURE_INTEGRATIONS.has(name)),
  /** No trace header on a call the proxy sends on — the API gets what it got before. */
  tracePropagationTargets: [],
  sendClientReports: false,
} satisfies NodeOptions

/**
 * How long a report may keep the function alive after its response — as long as Sentry's own keep-alive on Vercel.
 */
const FLUSH_MS = 2_000

/** [failure] sent to the tracker the environment names, if it names one — the SDK loaded and started on the first. */
async function sendToTracker(failure: unknown, status: number): Promise<void> {
  const settings = trackerSettingsOf(process.env)
  if (settings === undefined) return
  const Sentry = await import('@sentry/node')
  if (!Sentry.isInitialized()) Sentry.init({ ...settings, ...FAILURES_ONLY, beforeSend: serverEvent })
  Sentry.withScope((scope) => {
    scope.setTag('status', status.toString())
    Sentry.captureException(failure)
  })
  await Sentry.flush(FLUSH_MS)
}

/**
 * Files [failure] with the error tracker under the status the server path answered with, once the response has gone —
 * the platform keeps the function alive until the report is sent. A request that succeeds never loads the SDK.
 */
export function reportServerFailure(failure: unknown, status: number): void {
  waitUntil(
    sendToTracker(failure, status).catch((unsent: unknown) =>
      console.error('The error tracker took no report', unsent),
    ),
  )
}
