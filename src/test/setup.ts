import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { queryClient } from '../shared/api/queryClient'
import { server } from './server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
  queryClient.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } })
})
afterEach(() => {
  server.resetHandlers()
  queryClient.clear()
  localStorage.clear()
  sessionStorage.clear()
})
afterAll(() => server.close())
