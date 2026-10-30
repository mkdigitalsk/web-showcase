import * as Sentry from '@sentry/browser'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { sameAnswer } from '../analytics/consent'
import { keepAnswers } from '../services/consentCookies'
import { allSentToTheTracker, BUILT_TRACKER, forgetTheClient, thrownOnThePage } from '../../test/errorTracker'
import { eventsIn, trackerReceiving } from '../../test/trackerEnvelopes'
import { reportBrowserError, startBrowserErrorTracking } from './browserErrorTracking'

const ADDRESS = 'dana@example.com'
const TOKEN = 'k3y-0f-th3-l1nk'
const FRAGMENT = 'fr4gm3nt'
const SAID = `Cannot read the note for ${ADDRESS}`

/** A page whose address carries a visitor's address and a token in its query, and a fragment. */
const PAGE_WITH_DATA = `/privacy?email=${ADDRESS}&access=${TOKEN}#${FRAGMENT}`

/** What no envelope may carry — the visitor's address, a token, the page's fragment, what the error said. */
const NEVER_SENT = [ADDRESS, TOKEN, FRAGMENT, SAID]

/** A thrown value that is no `Error`, as the browser hands it on — a string carries no stack. */
function thrownWithNoStack(): void {
  window.onerror?.(`Uncaught ${SAID}`, window.location.href, 1, 1, SAID as unknown as Error)
}

describe('error tracking in the browser', () => {
  /** The tracker starts once the visitor allows it, their answer kept in the browser's cookies. */
  beforeEach(() => {
    keepAnswers(sameAnswer('granted'))
  })

  afterEach(() => {
    window.history.replaceState(null, '', '/')
    forgetTheClient()
  })

  it('runs the SDK on failures alone — no replay, no feedback widget, no tracing, no breadcrumbs, no sessions', () => {
    startBrowserErrorTracking(BUILT_TRACKER)

    const client = Sentry.getClient()
    for (const recorder of ['Replay', 'Feedback', 'BrowserTracing', 'Breadcrumbs', 'Console', 'BrowserSession']) {
      expect(client?.getIntegrationByName(recorder), recorder).toBeUndefined()
    }
    expect(client?.getIntegrationByName('GlobalHandlers')).toBeDefined()
    expect(client?.getOptions().tracesSampleRate).toBeUndefined()
  })

  it('sends an error thrown on a page under its environment, with the page and the browser, and nothing of the visitor or what it said', async () => {
    window.history.pushState(null, '', PAGE_WITH_DATA)
    const envelopes = trackerReceiving()
    startBrowserErrorTracking(BUILT_TRACKER)

    thrownOnThePage(new TypeError(SAID))
    await allSentToTheTracker()

    const [event, ...more] = eventsIn(envelopes)
    expect(more).toEqual([])
    expect(event?.environment).toBe('production')
    const [thrown] = event?.exception?.values ?? []
    expect(thrown?.type).toBe('TypeError')
    expect(thrown?.stacktrace?.frames?.length).toBeGreaterThan(0)
    expect(event?.request).toEqual({
      url: `${window.location.origin}/privacy`,
      headers: { 'User-Agent': window.navigator.userAgent },
    })
    expect(event?.user).toBeUndefined()
    expect(event?.breadcrumbs).toBeUndefined()
    expect(event?.sdk?.settings).toEqual({ infer_ip: 'never' })
    for (const kept of NEVER_SENT) expect(envelopes.join('\n'), kept).not.toContain(kept)
  })

  it('names the page a thrown value with no stack came from without its query or fragment', async () => {
    window.history.pushState(null, '', PAGE_WITH_DATA)
    const envelopes = trackerReceiving()
    startBrowserErrorTracking(BUILT_TRACKER)

    thrownWithNoStack()
    await allSentToTheTracker()

    const [event] = eventsIn(envelopes)
    const [frame] = event?.exception?.values?.[0]?.stacktrace?.frames ?? []
    expect(frame?.filename).toBe(`${window.location.origin}/privacy`)
    for (const kept of NEVER_SENT) expect(envelopes.join('\n'), kept).not.toContain(kept)
  })

  it('sends an error a route boundary caught, once', async () => {
    const envelopes = trackerReceiving()
    startBrowserErrorTracking(BUILT_TRACKER)

    reportBrowserError(new TypeError(SAID))
    await allSentToTheTracker()

    const [event, ...more] = eventsIn(envelopes)
    expect(more).toEqual([])
    expect(event?.exception?.values?.[0]?.type).toBe('TypeError')
    expect(envelopes.join('\n')).not.toContain(SAID)
  })
})
