import { next } from '@vercel/functions'

const ACCESS_COOKIE = 'site_access'
const ONE_YEAR = 60 * 60 * 24 * 365

// Basic Auth whenever SITE_PASSWORD is set; unsetting it opens the site with no code change.
// SITE_BYPASS_TOKEN plus a one-off visit to `/?access=<token>` drops a long-lived cookie, so a
// known device skips the prompt without being told the password.
export default function middleware(request: Request) {
  const password = process.env.SITE_PASSWORD
  if (!password) return next()

  const url = new URL(request.url)
  const bypass = process.env.SITE_BYPASS_TOKEN
  if (bypass) {
    // Magic link: store the bypass cookie, then redirect to the clean URL (without ?access).
    if (url.searchParams.get('access') === bypass) {
      url.searchParams.delete('access')
      return new Response(null, {
        status: 307,
        headers: {
          Location: url.toString(),
          'Set-Cookie': `${ACCESS_COOKIE}=${bypass}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${ONE_YEAR}`,
        },
      })
    }
    // This browser already holds the bypass cookie → let it through silently.
    const cookies = request.headers.get('cookie') ?? ''
    if (cookies.split(';').some((c) => c.trim() === `${ACCESS_COOKIE}=${bypass}`)) return next()
  }

  const user = process.env.SITE_USER ?? 'mk'
  const header = request.headers.get('authorization')
  if (header?.startsWith('Basic ')) {
    const decoded = atob(header.slice(6))
    const separator = decoded.indexOf(':')
    if (decoded.slice(0, separator) === user && decoded.slice(separator + 1) === password) {
      return next()
    }
  }

  // realm must be ASCII / Latin-1 only — HTTP header values are ByteStrings.
  return new Response('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="MK Digital"' },
  })
}

export const config = {
  // Gate everything except Vite's hashed static assets, favicon, and the notice the apps point at.
  matcher: ['/((?!assets/|favicon|privacy).*)'],
}
