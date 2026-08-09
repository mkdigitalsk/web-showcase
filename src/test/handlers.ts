import { http, HttpResponse } from 'msw'
import { API_PREFIX } from '../shared/api/apiVersion'
import { fakeAuthResponse, fakeUser } from './fakes'

// Wildcard origin (`*`) so handlers match regardless of the axios baseURL under test.
const auth = `*${API_PREFIX}/auth`
const users = `*${API_PREFIX}/users`

export const handlers = [
  http.post(`${auth}/sign-in`, () => HttpResponse.json(fakeAuthResponse())),

  http.post(`${auth}/sign-up`, () => HttpResponse.json(fakeAuthResponse())),

  http.get(users, () =>
    HttpResponse.json([
      fakeUser({ id: 1, name: 'Alice', email: 'alice@mkdigital.sk' }),
      fakeUser({ id: 2, name: 'Bob', email: 'bob@mkdigital.sk' }),
    ]),
  ),

  http.put(`${users}/me/theme-mode`, async ({ request }) => {
    const { themeMode } = (await request.json()) as { themeMode: string }
    return HttpResponse.json(fakeUser({ themeMode: themeMode as never }))
  }),

  http.put(`${users}/me/locale`, async ({ request }) => {
    const { locale } = (await request.json()) as { locale: string }
    return HttpResponse.json(fakeUser({ locale }))
  }),
]
