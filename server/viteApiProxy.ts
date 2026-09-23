import type { IncomingMessage, ServerResponse } from 'node:http'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { Connect, Plugin } from 'vite'
import { isApiRequest, proxyApi } from './apiProxy'

/** No silent fallback: the API a machine develops against is its own choice, and .env.local is where it lives. */
function requireApiUrl(apiUrl: string | undefined): void {
  if (!apiUrl) throw new Error('API_URL is required — set it in .env.local (e.g. http://localhost:8080)')
}

/**
 * The dev and preview servers answer `/v1` through the proxy the edge runs, so a session on localhost is the
 * cookie production sets and no second proxy drifts from it. The dev server refuses to start without an API; a
 * preview runs without one, since the build starts a preview of its own to render `index.html`.
 */
export function apiProxy(apiUrl: string | undefined): Plugin {
  const handle: Connect.NextHandleFunction = (req, res, next) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
    if (!apiUrl || !isApiRequest(url)) return next()
    forward(req, res, url, apiUrl).catch(next)
  }

  return {
    name: 'api-proxy',
    configureServer: (server) => {
      requireApiUrl(apiUrl)
      server.middlewares.use(handle)
    },
    configurePreviewServer: (server) => void server.middlewares.use(handle),
  }
}

async function forward(req: IncomingMessage, res: ServerResponse, url: URL, apiUrl: string): Promise<void> {
  const response = await proxyApi(await webRequest(req, url), apiUrl)
  await send(res, response)
}

async function webRequest(req: IncomingMessage, url: URL): Promise<Request> {
  const headers = new Headers()
  for (const [name, value] of Object.entries(req.headers)) {
    for (const each of [value ?? []].flat()) headers.append(name, each)
  }
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined

  return new Request(url, { method: req.method, headers, body })
}

async function send(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status
  response.headers.forEach((value, name) => {
    if (name !== 'set-cookie') res.setHeader(name, value)
  })
  const cookies = response.headers.getSetCookie()
  if (cookies.length > 0) res.setHeader('set-cookie', cookies)
  if (!response.body) return void res.end()
  await pipeline(Readable.fromWeb(response.body), res)
}
