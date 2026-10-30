import * as Sentry from '@sentry/vercel-edge'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../src/test/server'
import { eventsIn, TRACKER_DSN, trackerReceiving } from '../src/test/trackerEnvelopes'
import middleware from '../middleware'

const API = 'https://api.example.test'
const SITE = 'https://app.example.test'

afterEach(() => {
  Sentry.getCurrentScope().setClient(undefined)
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

function closeTheSite() {
  vi.stubEnv('SITE_PASSWORD', 'a-site-password')
  vi.stubEnv('API_URL', API)
}

/** A deployment whose environment names the error tracker. */
function nameTheTracker() {
  vi.stubEnv('SENTRY_DSN', TRACKER_DSN)
  vi.stubEnv('VERCEL_ENV', 'production')
}

const ADDRESS = 'dana@example.com'
const SESSION = 'k3y-0f-th3-s3ss10n'

/** A page's call to the API, carrying a visitor's address in its query and their session in its cookie. */
const apiCall = () =>
  new Request(`${SITE}/v1/notes?owner=${ADDRESS}`, { headers: { cookie: `__Host-session=${SESSION}` } })

/** What no report of a failed call may carry — the visitor's address, their session, the path they asked for. */
const NEVER_SENT = [ADDRESS, SESSION, '/v1/notes']

/** The API gone silent — every call to it fails before an answer. */
const apiSilent = () => server.use(http.get(`${API}/v1/notes`, () => HttpResponse.error()))

/** The failure's own lines in the host log, kept out of the run's output. */
const hostLog = () => vi.spyOn(console, 'error').mockImplementation(() => {})

describe('middleware', () => {
  it('asks a page for the site password while the site is closed', async () => {
    closeTheSite()

    const response = await middleware(new Request(`${SITE}/networking`))

    expect(response.status).toBe(401)
    expect(response.headers.get('www-authenticate')).toMatch(/^Basic /)
  })

  it('asks again for the password when the browser’s credentials are no base64', async () => {
    closeTheSite()

    const response = await middleware(new Request(`${SITE}/networking`, { headers: { authorization: 'Basic %%%' } }))

    expect(response.status).toBe(401)
    expect(response.headers.get('www-authenticate')).toMatch(/^Basic /)
  })

  it("lets a page's API call through to the API while the site is closed", async () => {
    closeTheSite()
    server.use(http.get(`${API}/v1/notes`, () => HttpResponse.json([])))

    const response = await middleware(new Request(`${SITE}/v1/notes`))

    expect(response.status).toBe(200)
  })
})

describe('a failure on the server path', () => {
  it('files the API’s silence with the tracker under the 502 the page got, and nothing of the call', async () => {
    nameTheTracker()
    vi.stubEnv('API_URL', API)
    apiSilent()
    hostLog()
    const envelopes = trackerReceiving()

    const response = await middleware(apiCall())

    expect(response.status).toBe(502)
    await vi.waitFor(() => expect(eventsIn(envelopes)).toHaveLength(1), { timeout: 5_000 })
    const [event] = eventsIn(envelopes)
    expect(event?.environment).toBe('production')
    expect(event?.tags).toEqual({ status: '502' })
    expect(event?.exception?.values?.[0]?.type).toBe('TypeError')
    expect(event?.exception?.values?.[0]?.stacktrace?.frames?.length).toBeGreaterThan(0)
    expect(event?.request).toBeUndefined()
    for (const kept of NEVER_SENT) expect(envelopes.join('\n'), kept).not.toContain(kept)
  })

  it('files a failure nothing on the path expected, and answers 500', async () => {
    nameTheTracker()
    const log = hostLog()
    const envelopes = trackerReceiving()

    const response = await middleware(apiCall())

    expect(response.status).toBe(500)
    expect(log).toHaveBeenCalled()
    await vi.waitFor(() => expect(eventsIn(envelopes)).toHaveLength(1), { timeout: 5_000 })
    expect(eventsIn(envelopes)[0]?.tags).toEqual({ status: '500' })
    expect(envelopes.join('\n'), 'what the failure said stays in the host log').not.toContain('API_URL is not set')
    for (const kept of NEVER_SENT) expect(envelopes.join('\n'), kept).not.toContain(kept)
  })

  it('files nothing while the environment names no tracker', async () => {
    vi.stubEnv('API_URL', API)
    apiSilent()
    hostLog()
    const envelopes = trackerReceiving()

    const response = await middleware(apiCall())

    expect(response.status).toBe(502)
    await Sentry.flush(1_000)
    expect(Sentry.isInitialized()).toBe(false)
    expect(envelopes).toEqual([])
  })
})
