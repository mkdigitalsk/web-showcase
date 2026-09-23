import { afterEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../src/test/server'
import { proxyApi, SESSION_COOKIE } from './apiProxy'

const API = 'https://api.example.test'
const SITE = 'https://app.example.test'
const NOW_SECONDS = 1_800_000_000

afterEach(() => vi.restoreAllMocks())

function jwtExpiringIn(seconds: number): string {
  const payload = Buffer.from(JSON.stringify({ exp: NOW_SECONDS + seconds })).toString('base64url')
  return `header.${payload}.signature`
}

function browserRequest(path: string, init: RequestInit & { cookie?: string } = {}): Request {
  const headers = new Headers(init.headers)
  if (init.cookie) headers.set('cookie', init.cookie)
  if (init.method && init.method !== 'GET' && !headers.has('origin')) headers.set('origin', SITE)
  return new Request(`${SITE}${path}`, { ...init, headers })
}

/** What reached the API, so a test asserts on the hop rather than on the proxy's intent. */
function recordUpstream(method: 'get' | 'post' | 'put' | 'delete', path: string, reply: () => Response) {
  const seen: Request[] = []
  server.use(
    http[method](`${API}${path}`, ({ request }) => {
      seen.push(request.clone())
      return reply()
    }),
  )
  return seen
}

const sessionCookie = (response: Response) =>
  response.headers.getSetCookie().find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))

describe('proxyApi', () => {
  it('forwards a request to the same path on the API, the session cookie becoming its bearer', async () => {
    const seen = recordUpstream('get', '/v1/notes', () => HttpResponse.json([{ id: 1 }]))

    const response = await proxyApi(browserRequest('/v1/notes?limit=5', { cookie: `${SESSION_COOKIE}=a.b.c` }), API)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([{ id: 1 }])
    expect(new URL(seen[0].url).search).toBe('?limit=5')
    expect(seen[0].headers.get('authorization')).toBe('Bearer a.b.c')
  })

  it('sends no bearer without a session', async () => {
    const seen = recordUpstream('get', '/v1/notes', () => HttpResponse.json([]))

    await proxyApi(browserRequest('/v1/notes'), API)

    expect(seen[0].headers.get('authorization')).toBeNull()
  })

  it('keeps the browser’s cookies and site credentials on this side of the hop', async () => {
    const seen = recordUpstream('get', '/v1/notes', () => HttpResponse.json([]))

    await proxyApi(
      browserRequest('/v1/notes', {
        cookie: `site_access=bypass; ${SESSION_COOKIE}=a.b.c`,
        headers: { authorization: 'Basic bWs6c2VjcmV0' },
      }),
      API,
    )

    expect(seen[0].headers.get('cookie')).toBeNull()
    expect(seen[0].headers.get('authorization')).toBe('Bearer a.b.c')
  })

  it('carries the body and the precondition of a write', async () => {
    const seen = recordUpstream('put', '/v1/notes/7', () => HttpResponse.json({ id: 7 }, { status: 412 }))

    const response = await proxyApi(
      browserRequest('/v1/notes/7', {
        method: 'PUT',
        cookie: `${SESSION_COOKIE}=a.b.c`,
        headers: { 'content-type': 'application/json', 'if-match': '"3"' },
        body: JSON.stringify({ title: 'Milk' }),
      }),
      API,
    )

    expect(response.status).toBe(412)
    expect(seen[0].headers.get('if-match')).toBe('"3"')
    expect(await seen[0].json()).toEqual({ title: 'Milk' })
  })

  it('turns the token of a sign-in into a cookie no script can read, and hands the page only the user', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW_SECONDS * 1000)
    const token = jwtExpiringIn(3600)
    recordUpstream('post', '/v1/auth/sign-in', () => HttpResponse.json({ token, user: { id: 1 } }))

    const response = await proxyApi(
      browserRequest('/v1/auth/sign-in', { method: 'POST', body: '{"email":"a@b.c","password":"x"}' }),
      API,
    )

    expect(await response.json()).toEqual({ user: { id: 1 } })
    expect(sessionCookie(response)).toBe(
      `${SESSION_COOKIE}=${token}; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax`,
    )
  })

  it('opens the session on a sign-up too, keeping its status', async () => {
    recordUpstream('post', '/v1/auth/sign-up', () =>
      HttpResponse.json({ token: jwtExpiringIn(60), user: { id: 2 } }, { status: 201 }),
    )

    const response = await proxyApi(browserRequest('/v1/auth/sign-up', { method: 'POST', body: '{}' }), API)

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ user: { id: 2 } })
    expect(sessionCookie(response)).toContain('HttpOnly')
  })

  it('leaves the session alone when a credential is rejected, which is not an expired session', async () => {
    recordUpstream('post', '/v1/auth/sign-in', () => HttpResponse.json({ message: 'Invalid' }, { status: 401 }))

    const response = await proxyApi(
      browserRequest('/v1/auth/sign-in', { method: 'POST', cookie: `${SESSION_COOKIE}=still.valid.token`, body: '{}' }),
      API,
    )

    expect(response.status).toBe(401)
    expect(sessionCookie(response)).toBeUndefined()
  })

  it('ends the session the API no longer accepts', async () => {
    recordUpstream('get', '/v1/users/me', () => new HttpResponse(null, { status: 401 }))

    const response = await proxyApi(browserRequest('/v1/users/me', { cookie: `${SESSION_COOKIE}=expired` }), API)

    expect(response.status).toBe(401)
    expect(sessionCookie(response)).toBe(`${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`)
  })

  it('sends a visitor who had no session no cookie on a 401', async () => {
    recordUpstream('get', '/v1/users/me', () => new HttpResponse(null, { status: 401 }))

    const response = await proxyApi(browserRequest('/v1/users/me'), API)

    expect(response.status).toBe(401)
    expect(response.headers.getSetCookie()).toEqual([])
  })

  it('signs out on its own, without the API', async () => {
    const seen = recordUpstream('post', '/v1/auth/sign-out', () => new HttpResponse(null, { status: 500 }))

    const response = await proxyApi(
      browserRequest('/v1/auth/sign-out', { method: 'POST', cookie: `${SESSION_COOKIE}=a.b.c` }),
      API,
    )

    expect(response.status).toBe(204)
    expect(seen).toHaveLength(0)
    expect(sessionCookie(response)).toContain('Max-Age=0')
    expect(response.headers.get('clear-site-data')).toBeNull()
  })

  it.each([
    ['a relayed answer', '/v1/notes', () => HttpResponse.json([{ id: 1 }])],
    ['a sign-in', '/v1/auth/sign-in', () => HttpResponse.json({ token: 'a.b.c', user: { id: 1 } })],
  ])('keeps %s out of every cache, so a shared machine holds nothing of the account', async (_case, path, reply) => {
    recordUpstream(path.includes('auth') ? 'post' : 'get', path, reply)
    const method = path.includes('auth') ? 'POST' : 'GET'

    const response = await proxyApi(browserRequest(path, { method, body: method === 'POST' ? '{}' : undefined }), API)

    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it.each([
    ['another site', 'https://evil.example.test'],
    ['no origin at all', null],
  ])('refuses a write from %s before it reaches the API', async (_case, origin) => {
    const seen = recordUpstream('delete', '/v1/users/me', () => new HttpResponse(null, { status: 204 }))
    const headers = new Headers()
    if (origin) headers.set('origin', origin)
    headers.set('cookie', `${SESSION_COOKIE}=a.b.c`)

    const response = await proxyApi(new Request(`${SITE}/v1/users/me`, { method: 'DELETE', headers }), API)

    expect(response.status).toBe(403)
    expect(seen).toHaveLength(0)
  })

  it('answers 502 when the API cannot be reached', async () => {
    server.use(http.get(`${API}/v1/notes`, () => HttpResponse.error()))

    const response = await proxyApi(browserRequest('/v1/notes'), API)

    expect(response.status).toBe(502)
  })
})
