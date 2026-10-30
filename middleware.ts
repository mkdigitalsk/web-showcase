import { next } from '@vercel/functions'
import { isApiRequest, proxyApi } from './server/apiProxy.js'
import { reportServerFailure } from './server/errorTracking.js'
import { TRACKER_SETTINGS_PATH, trackerSettingsOf } from './src/shared/errorTracking/trackerSettings.js'

const ACCESS_COOKIE = 'site_access'
const ONE_YEAR = 60 * 60 * 24 * 365
const HTTP_UNAUTHORIZED = 401
const HTTP_SERVER_ERROR = 500

/** ASCII / Latin-1 only — an HTTP header value is a ByteString. */
const REALM = 'MK Digital'

function storeBypassCookieAndRedirect(url: URL, bypass: string): Response {
  url.searchParams.delete('access')
  return new Response(null, {
    status: 307,
    headers: {
      Location: url.toString(),
      'Set-Cookie': `${ACCESS_COOKIE}=${bypass}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${ONE_YEAR}`,
    },
  })
}

function holdsBypassCookie(request: Request, bypass: string): boolean {
  const cookies = request.headers.get('cookie') ?? ''
  return cookies.split(';').some((c) => c.trim() === `${ACCESS_COOKIE}=${bypass}`)
}

/** The `user:password` a Basic header carries — none where there is no such header, or its value is no base64. */
function basicCredentials(request: Request): string | undefined {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return undefined
  try {
    return atob(header.slice(6))
  } catch {
    return undefined
  }
}

function holdsSiteCredentials(request: Request, password: string): boolean {
  const user = process.env.SITE_USER ?? 'mk'
  const decoded = basicCredentials(request)
  if (decoded === undefined) return false
  const separator = decoded.indexOf(':')
  return decoded.slice(0, separator) === user && decoded.slice(separator + 1) === password
}

function refuse(): Response {
  return new Response('Authentication required.', {
    status: HTTP_UNAUTHORIZED,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}"` },
  })
}

/**
 * Basic Auth whenever SITE_PASSWORD is set; unsetting it opens the site with no code change.
 * SITE_BYPASS_TOKEN plus a one-off visit to `/?access=<token>` drops a long-lived cookie, so a known
 * device skips the prompt without being told the password.
 *
 * @returns the response that ends the request here, or `undefined` to let it through.
 */
function siteGate(request: Request, url: URL): Response | undefined {
  const password = process.env.SITE_PASSWORD
  if (!password) return undefined

  const bypass = process.env.SITE_BYPASS_TOKEN
  if (bypass) {
    if (url.searchParams.get('access') === bypass) return storeBypassCookieAndRedirect(url, bypass)
    if (holdsBypassCookie(request, bypass)) return undefined
  }
  return holdsSiteCredentials(request, password) ? undefined : refuse()
}

/**
 * API_URL is read per request, so one build serves every environment the platform points it at. A call the API gives
 * no answer is filed with the error tracker under the status the page gets.
 */
function forwardToApi(request: Request): Promise<Response> {
  const apiUrl = process.env.API_URL
  if (!apiUrl) throw new Error('API_URL is not set, so /v1 has nowhere to go')
  return proxyApi(request, apiUrl, { proxyKey: process.env.PROXY_KEY, reportUnanswered: reportServerFailure })
}

/** The tracker the browser starts once the visitor allows it, read per request as API_URL is. */
function trackerSettings(): Response {
  return Response.json(trackerSettingsOf(process.env) ?? null)
}

/**
 * `/v1` skips the gate: the API's own authorization is the boundary, and a browser need not resend the site password
 * unchallenged ([RFC 7617 § 2.2](https://www.rfc-editor.org/rfc/rfc7617#section-2.2)). The tracker's settings skip it
 * for the same reason — the privacy notice, which the gate leaves open, asks for them — and a DSN only lets a page
 * send events.
 *
 * @see {@link https://docs.sentry.io/concepts/key-terms/dsn-explainer/#dsn-utilization | Sentry — Data Source Name (DSN), DSN Utilization}
 */
function routed(request: Request): Promise<Response> | Response {
  const url = new URL(request.url)
  if (isApiRequest(url)) return forwardToApi(request)
  if (url.pathname === TRACKER_SETTINGS_PATH) return trackerSettings()
  return siteGate(request, url) ?? next()
}

/** Every request the matcher takes — a failure on its way is logged, filed with the error tracker, answered 500. */
export default async function middleware(request: Request): Promise<Response> {
  try {
    return await routed(request)
  } catch (failure) {
    console.error('The server path failed', failure)
    reportServerFailure(failure, HTTP_SERVER_ERROR)
    return new Response(null, { status: HTTP_SERVER_ERROR })
  }
}

export const config = {
  /** Runs on everything except the hashed static assets, the favicon and the notice the apps point at. */
  matcher: ['/((?!assets/|favicon|privacy).*)'],
}
