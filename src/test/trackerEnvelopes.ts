import type { ErrorEvent } from '@sentry/browser'
import { http, HttpResponse } from 'msw'
import { server } from './server'

/** A tracker project's DSN — the envelopes it names are the network edge a test fakes. */
export const TRACKER_DSN = 'https://public@tracker.example.com/1'

const ENVELOPES = 'https://tracker.example.com/api/1/envelope/'

/** Each envelope posted to the tracker, as the text it carried. */
export function trackerReceiving(): string[] {
  const envelopes: string[] = []
  server.use(
    http.post(ENVELOPES, async ({ request }) => {
      envelopes.push(await request.text())
      return HttpResponse.json({})
    }),
  )
  return envelopes
}

/** The events among the envelopes' items — an envelope is a header line, then a header and a payload line an item. */
export function eventsIn(envelopes: readonly string[]): ErrorEvent[] {
  return envelopes.flatMap((envelope) => {
    const [, ...lines] = envelope.split('\n').filter((line) => line !== '')
    const items = lines.flatMap((header, at) => (at % 2 === 0 ? [{ header, payload: lines[at + 1] ?? '' }] : []))
    return items
      .filter(({ header }) => (JSON.parse(header) as { type?: string }).type === 'event')
      .map(({ payload }) => JSON.parse(payload) as ErrorEvent)
  })
}
