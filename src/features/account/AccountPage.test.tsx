import 'fake-indexeddb/auto'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { API_PREFIX } from '../../shared/api/apiVersion'
import { clearLocalUserData } from '../../shared/services/clearLocalUserData'
import { StorageKey } from '../../shared/enums/storageKey'
import { db } from '../../shared/services/db'
import { renderApp, screen, server, http, HttpResponse, userEvent, fakeAuthUser, fakeNote } from '../../test/test-utils'
import { Routes } from '../../utils'
import type { AuthUser } from '../../shared/types'

const account = `*${API_PREFIX}/users/me`
const signOutRoute = `*${API_PREFIX}/auth/sign-out`

afterEach(async () => {
  await db.notes.clear()
})

async function signIn(user: Partial<AuthUser> | object = {}) {
  server.use(http.get(account, () => HttpResponse.json({ ...fakeAuthUser(), ...user })))
  localStorage.setItem(StorageKey.PERSISTENT_COUNTER, '3')
  sessionStorage.setItem(StorageKey.SESSION_COUNTER, '2')
  await db.notes.add(fakeNote())
}

/** Every call the page made, in order, so a test can read what reached the proxy and when. */
function recordCalls() {
  const calls: string[] = []
  server.events.on('request:start', ({ request }) => calls.push(`${request.method} ${new URL(request.url).pathname}`))
  return calls
}

async function openAccountPage() {
  await renderApp(Routes.ACCOUNT)
  await screen.findByRole('heading', { level: 1, name: 'Account' })
}

async function confirmDeletion() {
  await userEvent.click(screen.getByRole('button', { name: 'Delete account' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))
}

async function expectThisDeviceCleared() {
  expect(localStorage.getItem(StorageKey.PERSISTENT_COUNTER)).toBeNull()
  expect(sessionStorage.getItem(StorageKey.SESSION_COUNTER)).toBeNull()
  expect(await db.notes.toArray()).toHaveLength(0)
}

async function expectThisDeviceKept() {
  expect(localStorage.getItem(StorageKey.PERSISTENT_COUNTER)).toBe('3')
  expect(sessionStorage.getItem(StorageKey.SESSION_COUNTER)).toBe('2')
  expect(await db.notes.toArray()).toHaveLength(1)
}

describe('AccountPage', () => {
  it('names itself with a heading and shows the signed-in email', async () => {
    await signIn()
    await openAccountPage()

    expect(screen.getByText('test01@mkdigital.sk')).toBeVisible()
  })

  it('offers deletion on a normal account', async () => {
    await signIn()
    await openAccountPage()

    expect(screen.getByRole('button', { name: 'Delete account' })).toBeVisible()
    expect(screen.queryByText('This is a demo account, so it cannot be deleted.')).not.toBeInTheDocument()
  })

  it('explains itself instead of offering deletion on a demo account', async () => {
    await signIn({ demo: true })
    await openAccountPage()

    expect(screen.getByText('This is a demo account, so it cannot be deleted.')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Delete account' })).not.toBeInTheDocument()
  })

  it('reads an account the API sends without the demo flag as a normal one', async () => {
    const { id, email, themeMode, locale } = fakeAuthUser()
    server.use(http.get(account, () => HttpResponse.json({ id, email, themeMode, locale })))
    await openAccountPage()

    expect(screen.getByRole('button', { name: 'Delete account' })).toBeVisible()
  })

  it('deletes on the server while the session still authorizes it, then ends the session, then clears this device', async () => {
    await signIn()
    await openAccountPage()
    const calls = recordCalls()

    await confirmDeletion()

    expect(await screen.findByRole('button', { name: 'Sign In' })).toBeVisible()
    expect(calls.filter((call) => !call.startsWith('GET'))).toEqual([
      `DELETE ${API_PREFIX}/users/me`,
      `POST ${API_PREFIX}/auth/sign-out`,
    ])
    await expectThisDeviceCleared()
  })

  it('ends the session and takes the local data with it when signing out', async () => {
    await signIn()
    await openAccountPage()
    const calls = recordCalls()

    await userEvent.click(screen.getByRole('button', { name: 'Sign Out' }))

    expect(await screen.findByRole('button', { name: 'Sign In' })).toBeVisible()
    expect(calls).toContain(`POST ${API_PREFIX}/auth/sign-out`)
    await expectThisDeviceCleared()
  })

  it('keeps the person signed in, and says so, when the session will not end', async () => {
    server.use(http.post(signOutRoute, () => new HttpResponse(null, { status: 500 })))
    await signIn()
    await openAccountPage()

    await userEvent.click(screen.getByRole('button', { name: 'Sign Out' }))

    expect(await screen.findByText('Something went wrong on our side. Try again shortly.')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument()
    await expectThisDeviceKept()
  })

  it('clears this device even when the session will not end once the account is gone', async () => {
    server.use(http.post(signOutRoute, () => HttpResponse.error()))
    await signIn()
    await openAccountPage()

    await confirmDeletion()

    expect(await screen.findByRole('button', { name: 'Sign In' })).toBeVisible()
    await expectThisDeviceCleared()
  })

  it('explains a refusal instead of asking for a retry that cannot work', async () => {
    server.use(http.delete(account, () => new HttpResponse(null, { status: 403 })))
    await signIn()
    await openAccountPage()

    await confirmDeletion()

    expect(await screen.findByText('This is a demo account, so it cannot be deleted.')).toBeVisible()
    expect(screen.queryByText('Your account could not be deleted. Try again.')).not.toBeInTheDocument()
  })

  it('keeps the person and their local data when the route is not there', async () => {
    server.use(http.delete(account, () => new HttpResponse(null, { status: 404 })))
    await signIn()
    await openAccountPage()

    await confirmDeletion()

    expect(await screen.findByText('Your account could not be deleted. Try again.')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument()
    await expectThisDeviceKept()
  })

  it('keeps the person and their local data when the server fails', async () => {
    server.use(http.delete(account, () => new HttpResponse(null, { status: 500 })))
    await signIn()
    await openAccountPage()

    await confirmDeletion()

    expect(await screen.findByText('Something went wrong on our side. Try again shortly.')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument()
    await expectThisDeviceKept()
  })

  it('clears the rest of this device even when the local database refuses to clear', async () => {
    const clear = vi.spyOn(db.notes, 'clear').mockRejectedValue(new Error('IndexedDB unavailable'))
    await signIn()

    await expect(clearLocalUserData(new QueryClient())).resolves.toBeUndefined()

    expect(localStorage.getItem(StorageKey.PERSISTENT_COUNTER)).toBeNull()
    expect(sessionStorage.getItem(StorageKey.SESSION_COUNTER)).toBeNull()
    clear.mockRestore()
  })
})
