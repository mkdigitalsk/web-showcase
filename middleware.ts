import { next } from '@vercel/functions'
import { isApiRequest, proxyApi } from './server/apiProxy'

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

function holdsSiteCredentials(request: Request, password: string): boolean {
  const user = process.env.SITE_USER ?? 'mk'
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return false
  const decoded = atob(header.slice(6))
  const separator = decoded.indexOf(':')
  return decoded.slice(0, separator) === user && decoded.slice(separator + 1) === password
}

/**
 * An API call is refused without the challenge: a page the gate leaves open — the privacy notice — still asks
 * who is signed in, and a challenge there would open the browser's password prompt over it.
 */
function refuse(url: URL): Response {
  if (isApiRequest(url)) return new Response(null, { status: HTTP_UNAUTHORIZED })
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
  return holdsSiteCredentials(request, password) ? undefined : refuse(url)
}

/** API_URL is read per request, so one build serves every environment the platform points it at. */
function forwardToApi(request: Request): Promise<Response> | Response {
  const apiUrl = process.env.API_URL
  if (apiUrl) return proxyApi(request, apiUrl)
  console.error('API_URL is not set, so /v1 has nowhere to go')
  return new Response(null, { status: HTTP_SERVER_ERROR })
}

/** The site gate first, then `/v1` to the API through the session proxy, and everything else to the static app. */
export default function middleware(request: Request) {
  const url = new URL(request.url)
  const refusal = siteGate(request, url)
  if (refusal) return refusal
  return isApiRequest(url) ? forwardToApi(request) : next()
}

export const config = {
  /** Gates everything except the hashed static assets, the favicon and the notice the apps point at. */
  matcher: ['/((?!assets/|favicon|privacy).*)'],
}
