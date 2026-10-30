import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { queryClient } from '../shared/api/queryClient'
import { server } from './server'

/** jsdom ships no ResizeObserver — the consent bar keeps the page's scroll padding as tall as itself with one. */
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

/** Expires every cookie the page holds — a consent one test kept is no answer the next one gave. */
function clearCookies() {
  for (const cookie of document.cookie.split('; ').filter(Boolean)) {
    document.cookie = `${cookie.slice(0, cookie.indexOf('='))}=; path=/; max-age=0`
  }
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
  queryClient.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } })
})
afterEach(() => {
  server.resetHandlers()
  queryClient.clear()
  localStorage.clear()
  sessionStorage.clear()
  clearCookies()
})
afterAll(() => server.close())
