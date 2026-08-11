import 'fake-indexeddb/auto'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { QueryClient } from '@tanstack/react-query'
import { API_PREFIX } from '../../shared/api/apiVersion'
import { clearLocalUserData } from '../../shared/services/clearLocalUserData'
import { StorageKey } from '../../shared/enums/storageKey'
import { db } from '../../shared/services/db'
import {
  renderWithProviders,
  screen,
  server,
  http,
  HttpResponse,
  userEvent,
  fakeAuthUser,
  fakeNote,
} from '../../test/test-utils'
import { Routes as AppRoutes } from '../../utils'
import { AccountPage } from './AccountPage'

const account = `*${API_PREFIX}/users/me`

afterEach(async () => {
  await db.notes.clear()
})

async function signIn() {
  localStorage.setItem(StorageKey.TOKEN, 'fake.jwt.token')
  localStorage.setItem(StorageKey.USER, JSON.stringify(fakeAuthUser()))
  localStorage.setItem(StorageKey.PERSISTENT_COUNTER, '3')
  sessionStorage.setItem(StorageKey.SESSION_COUNTER, '2')
  await db.notes.add(fakeNote())
}

function renderAccountPage() {
  return renderWithProviders(
    <Routes>
      <Route path={AppRoutes.ACCOUNT} element={<AccountPage />} />
      <Route path={AppRoutes.SIGN_IN} element={<div>Sign In Screen</div>} />
    </Routes>,
    { route: AppRoutes.ACCOUNT, useRealAuth: true },
  )
}

async function confirmDeletion() {
  await userEvent.click(screen.getByRole('button', { name: 'Delete account' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))
}

describe('AccountPage', () => {
  it('names itself with a heading and shows the signed-in email', async () => {
    await signIn()
    renderAccountPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Account' })).toBeInTheDocument()
    expect(screen.getByText('test01@mkdigital.sk')).toBeVisible()
  })

  // The bearer proves the order: the call went out before the teardown took the token away.
  it('deletes on the server, then clears this device, then lands on sign-in', async () => {
    let bearer: string | null = null
    server.use(
      http.delete(account, ({ request }) => {
        bearer = request.headers.get('Authorization')
        return new HttpResponse(null, { status: 204 })
      }),
    )
    await signIn()
    renderAccountPage()

    await confirmDeletion()

    expect(await screen.findByText('Sign In Screen')).toBeVisible()
    expect(bearer).toBe('Bearer fake.jwt.token')
    expect(localStorage.getItem(StorageKey.TOKEN)).toBeNull()
    expect(localStorage.getItem(StorageKey.USER)).toBeNull()
    expect(localStorage.getItem(StorageKey.PERSISTENT_COUNTER)).toBeNull()
    expect(sessionStorage.getItem(StorageKey.SESSION_COUNTER)).toBeNull()
    expect(await db.notes.toArray()).toHaveLength(0)
  })

  it('takes the local data with it when signing out', async () => {
    await signIn()
    renderAccountPage()

    await userEvent.click(screen.getByRole('button', { name: 'Sign Out' }))

    expect(await screen.findByText('Sign In Screen')).toBeVisible()
    expect(localStorage.getItem(StorageKey.TOKEN)).toBeNull()
    expect(localStorage.getItem(StorageKey.USER)).toBeNull()
    expect(localStorage.getItem(StorageKey.PERSISTENT_COUNTER)).toBeNull()
    expect(sessionStorage.getItem(StorageKey.SESSION_COUNTER)).toBeNull()
    expect(await db.notes.toArray()).toHaveLength(0)
  })

  it('keeps the person and their local data when the route is not there', async () => {
    server.use(http.delete(account, () => new HttpResponse(null, { status: 404 })))
    await signIn()
    renderAccountPage()

    await confirmDeletion()

    expect(screen.queryByText('Sign In Screen')).not.toBeInTheDocument()
    expect(localStorage.getItem(StorageKey.TOKEN)).not.toBeNull()
    expect(await db.notes.toArray()).toHaveLength(1)
  })

  it('signs the person out even when the local database refuses to clear', async () => {
    const clear = vi.spyOn(db.notes, 'clear').mockRejectedValue(new Error('IndexedDB unavailable'))
    await signIn()
    renderAccountPage()

    await expect(clearLocalUserData(new QueryClient())).resolves.toBeUndefined()

    expect(localStorage.getItem(StorageKey.TOKEN)).toBeNull()
    clear.mockRestore()
  })

  it('keeps the person and their local data when the server refuses', async () => {
    server.use(http.delete(account, () => new HttpResponse(null, { status: 403 })))
    await signIn()
    renderAccountPage()

    await confirmDeletion()

    expect(await screen.findByText('Your account could not be deleted. Try again.')).toBeVisible()
    expect(screen.queryByText('Sign In Screen')).not.toBeInTheDocument()
    expect(localStorage.getItem(StorageKey.TOKEN)).toBe('fake.jwt.token')
    expect(localStorage.getItem(StorageKey.PERSISTENT_COUNTER)).toBe('3')
    expect(sessionStorage.getItem(StorageKey.SESSION_COUNTER)).toBe('2')
    expect(await db.notes.toArray()).toHaveLength(1)
  })
})
