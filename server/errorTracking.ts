import type { TransportMakeRequestResponse, TransportRequest } from '@sentry/core'
import type { ServerRuntimeClientOptions } from '@sentry/core/server'
import { waitUntil } from '@vercel/functions'
import { serverEvent } from '../src/shared/errorTracking/trackerEvent.js'
import { trackerSettingsOf, type TrackerSettings } from '../src/shared/errorTracking/trackerSettings.js'

/** What the client gathers on its own, held to the failure itself. */
const FAILURES_ONLY = {
  /** No count of the events it drops — a count says a failure happened, and nothing else of it. */
  sendClientReports: false,
  /** The edge runtime, named as Sentry's own edge SDK names it. */
  runtime: { name: 'vercel-edge' },
  platform: 'javascript',
  beforeSend: serverEvent,
} satisfies Partial<ServerRuntimeClientOptions>

/** How long a report may keep the function alive after its response, so a slow tracker never holds it longer. */
const FLUSH_MS = 2_000

/**
 * An envelope posted to the tracker with `fetch`, the edge's one way out, with the limits the tracker answers by. A
 * binary envelope is copied onto a buffer of its own, the only kind a request body takes.
 */
async function postEnvelope(url: string, { body }: TransportRequest): Promise<TransportMakeRequestResponse> {
  const response = await fetch(url, { method: 'POST', body: typeof body === 'string' ? body : new Uint8Array(body) })
  return {
    statusCode: response.status,
    headers: {
      'x-sentry-rate-limits': response.headers.get('X-Sentry-Rate-Limits'),
      'retry-after': response.headers.get('Retry-After'),
    },
  }
}

/**
 * Sentry's client for a runtime with no Node, started once on the first failure — Sentry's core built the way its own
 * edge SDK builds it, without the tracing context that SDK sets up, whose package the edge cannot load. It carries the
 * integrations that say where a failure happened, and none that record the server around it.
 */
async function trackerFor(settings: TrackerSettings) {
  const [core, server] = await Promise.all([import('@sentry/core'), import('@sentry/core/server')])
  if (core.isInitialized()) return core
  core.initAndBind(server.ServerRuntimeClient, {
    ...settings,
    ...FAILURES_ONLY,
    integrations: [
      core.eventFiltersIntegration(),
      core.functionToStringIntegration(),
      core.linkedErrorsIntegration(),
      core.dedupeIntegration(),
    ],
    stackParser: core.createStackParser(server.nodeStackLineParser()),
    transport: (options) => core.createTransport(options, (request) => postEnvelope(options.url, request)),
  })
  return core
}

/** [failure] sent to the tracker the environment names, if it names one. */
async function sendToTracker(failure: unknown, status: number): Promise<void> {
  const settings = trackerSettingsOf(process.env)
  if (settings === undefined) return
  const tracker = await trackerFor(settings)
  tracker.withScope((scope) => {
    scope.setTag('status', status.toString())
    tracker.captureException(failure)
  })
  await tracker.flush(FLUSH_MS)
}

/**
 * Files [failure] with the error tracker under the status the server path answered with, once the response has gone —
 * the platform keeps the function alive until the report is sent. A request that succeeds never loads the client.
 */
export function reportServerFailure(failure: unknown, status: number): void {
  waitUntil(
    sendToTracker(failure, status).catch((unsent: unknown) =>
      console.error('The error tracker took no report', unsent),
    ),
  )
}
