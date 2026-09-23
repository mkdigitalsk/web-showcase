import { http, HttpResponse } from 'msw'
import { API_PREFIX } from '../shared/api/apiVersion'
import { fakeAuthResponse, fakeRemoteNote, fakeUser } from './fakes'

/**
 * The page's side of the proxy: what `/v1` answers the browser, with the token already taken into the cookie.
 * Any origin, so a handler matches however the request was addressed. A visitor starts signed out.
 */
const anyOrigin = (path: string) => `*${API_PREFIX}${path}`
const auth = anyOrigin('/auth')
const users = anyOrigin('/users')
const notes = anyOrigin('/notes')

export const handlers = [
  http.get(notes, () => HttpResponse.json([fakeRemoteNote()])),

  http.post(`${auth}/sign-in`, () => HttpResponse.json(fakeAuthResponse())),

  http.post(`${auth}/sign-up`, () => HttpResponse.json(fakeAuthResponse(), { status: 201 })),

  http.post(`${auth}/sign-out`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${users}/me`, () => new HttpResponse(null, { status: 401 })),

  http.put(`${users}/me/theme-mode`, async ({ request }) => {
    const { themeMode } = (await request.json()) as { themeMode: string }
    return HttpResponse.json(fakeUser({ themeMode: themeMode as never }))
  }),

  http.put(`${users}/me/locale`, async ({ request }) => {
    const { locale } = (await request.json()) as { locale: string }
    return HttpResponse.json(fakeUser({ locale }))
  }),

  http.delete(`${users}/me`, () => new HttpResponse(null, { status: 204 })),
]
