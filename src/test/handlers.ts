import { http, HttpResponse } from 'msw'
import { API_PREFIX } from '../shared/api/apiVersion'
import { fakeAuthResponse, fakeUser } from './fakes'

// Wildcard origin (`*`) so handlers match regardless of the axios baseURL under test.
const auth = `*${API_PREFIX}/auth`
const users = `*${API_PREFIX}/users`

export const handlers = [
  http.post(`${auth}/login`, () => HttpResponse.json(fakeAuthResponse())),

  http.post(`${auth}/register`, () => HttpResponse.json(fakeAuthResponse())),

  http.get(users, () => HttpResponse.json([fakeUser({ id: 1, name: 'Alice', email: 'alice@mkdigital.sk' }), fakeUser({ id: 2, name: 'Bob', email: 'bob@mkdigital.sk' })])),
]
