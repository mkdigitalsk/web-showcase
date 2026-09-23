import { API_PREFIX } from '../src/shared/api/apiVersion.js'

/** `__Host-` pins it to this host, `/` and `Secure` — browsers honour `Secure` on localhost too. */
export const SESSION_COOKIE = '__Host-session'

const AUTH_PREFIX = `${API_PREFIX}/auth/`
const SIGN_OUT_PATH = `${AUTH_PREFIX}sign-out`
const COOKIE_ATTRIBUTES = 'HttpOnly; Secure; SameSite=Lax'
const EXPIRED_SESSION = `${SESSION_COOKIE}=; Path=/; Max-Age=0; ${COOKIE_ATTRIBUTES}`
const SAFE_METHODS = new Set(['GET', 'HEAD'])
const HTTP = { NO_CONTENT: 204, UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_ALLOWED: 405, BAD_GATEWAY: 502 } as const

/**
 * Only what the API reads crosses the hop. The browser's cookies, its Basic credentials for the site gate
 * and the platform's own headers stay on this side.
 */
const FORWARDED_REQUEST_HEADERS = ['accept', 'accept-language', 'content-type', 'if-match', 'if-none-match']

/** fetch has already decoded the body and knows its length; on this origin only the proxy writes cookies. */
const DROPPED_RESPONSE_HEADERS = ['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'set-cookie']

export function isApiRequest(url: URL): boolean {
  return url.pathname.startsWith(`${API_PREFIX}/`)
}

/**
 * The browser's one way to the API, served from the app's own origin — so the bearer lives in a cookie no
 * script can read, and the page never holds a token ([OWASP — Token Storage][owasp]).
 *
 * - An auth route's token becomes the session cookie, and the page receives the rest of the body.
 * - Every other call carries the cookie to the API as its bearer; a 401 there ends the session.
 * - Every answer is `no-store`, so the HTTP cache of a shared machine never holds the account.
 * - Sign-out is the proxy's own route: it expires the cookie and sends no `Clear-Site-Data`. `"cookies"` reaches
 *   the whole registrable domain and its HTTP credentials ([MDN][csd]), `"storage"` deletes IndexedDB under a
 *   live Dexie connection the app empties itself, and `"cache"` holds the response for seconds in Chrome
 *   ([Chromium][crbug]) to clear a cache that `no-store` already keeps empty.
 * - A write must carry this origin in `Origin` — the API's own origin check sees the proxy, never the page.
 *
 * [owasp]: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage
 * [csd]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Clear-Site-Data#cookies
 * [crbug]: https://issues.chromium.org/issues/40233601
 *
 * @param apiUrl the API's origin, read at runtime — the browser bundle never carries it.
 */
export async function proxyApi(request: Request, apiUrl: string): Promise<Response> {
  const url = new URL(request.url)
  if (!SAFE_METHODS.has(request.method) && request.headers.get('origin') !== url.origin) {
    return new Response(null, { status: HTTP.FORBIDDEN })
  }
  if (url.pathname === SIGN_OUT_PATH) return signOut(request)

  const session = readCookie(request, SESSION_COOKIE)
  const upstream = await callApi(request, url, apiUrl, session)
  if (url.pathname.startsWith(AUTH_PREFIX)) return upstream.ok ? openSession(upstream) : relay(upstream)
  return relay(upstream, session && upstream.status === HTTP.UNAUTHORIZED ? [EXPIRED_SESSION] : [])
}

async function callApi(request: Request, url: URL, apiUrl: string, session: string | undefined): Promise<Response> {
  const headers = new Headers()
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name)
    if (value !== null) headers.set(name, value)
  }
  if (session) headers.set('authorization', `Bearer ${session}`)
  const body = SAFE_METHODS.has(request.method) ? undefined : await request.arrayBuffer()

  try {
    return await fetch(new URL(`${url.pathname}${url.search}`, apiUrl), {
      method: request.method,
      headers,
      body: body?.byteLength ? body : undefined,
    })
  } catch (error) {
    console.error('API unreachable', error)
    return new Response(null, { status: HTTP.BAD_GATEWAY })
  }
}

function signOut(request: Request): Response {
  if (request.method !== 'POST') return new Response(null, { status: HTTP.NOT_ALLOWED, headers: { allow: 'POST' } })
  return new Response(null, { status: HTTP.NO_CONTENT, headers: { 'set-cookie': EXPIRED_SESSION } })
}

async function openSession(upstream: Response): Promise<Response> {
  if (!upstream.headers.get('content-type')?.includes('json')) return relay(upstream)
  const { token, ...rest } = (await upstream.json()) as Record<string, unknown>
  const headers = relayedHeaders(upstream, typeof token === 'string' ? [sessionCookie(token)] : [])
  return Response.json(rest, { status: upstream.status, headers })
}

function relay(upstream: Response, cookies: string[] = []): Response {
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: relayedHeaders(upstream, cookies),
  })
}

function relayedHeaders(upstream: Response, cookies: string[]): Headers {
  const headers = new Headers(upstream.headers)
  for (const name of DROPPED_RESPONSE_HEADERS) headers.delete(name)
  headers.set('cache-control', 'no-store')
  for (const cookie of cookies) headers.append('set-cookie', cookie)
  return headers
}

/** The cookie lives exactly as long as the token; one whose expiry cannot be read ends with the browser. */
function sessionCookie(token: string): string {
  const seconds = secondsUntilExpiry(token)
  const maxAge = seconds === undefined ? '' : ` Max-Age=${seconds};`
  return `${SESSION_COOKIE}=${token}; Path=/;${maxAge} ${COOKIE_ATTRIBUTES}`
}

function secondsUntilExpiry(token: string): number | undefined {
  const payload = token.split('.')[1]
  if (!payload) return undefined
  try {
    const { exp } = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: unknown }
    return typeof exp === 'number' ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : undefined
  } catch {
    return undefined
  }
}

function readCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.get('cookie')?.split(';') ?? []
  const pair = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`))
  return pair?.slice(name.length + 1) || undefined
}
