import { afterEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../src/test/server'
import middleware from '../middleware'

const API = 'https://api.example.test'
const SITE = 'https://app.example.test'

afterEach(() => vi.unstubAllEnvs())

function closeTheSite() {
  vi.stubEnv('SITE_PASSWORD', 'a-site-password')
  vi.stubEnv('API_URL', API)
}

describe('middleware', () => {
  it('asks a page for the site password while the site is closed', async () => {
    closeTheSite()

    const response = await middleware(new Request(`${SITE}/networking`))

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
