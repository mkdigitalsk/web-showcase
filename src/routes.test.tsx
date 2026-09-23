import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { API_PREFIX } from './shared/api/apiVersion'
import { fakeAuthUser, http, HttpResponse, renderApp, screen, server, userEvent } from './test/test-utils'
import { Routes } from './utils'

const me = `*${API_PREFIX}/users/me`
const signedIn = () => server.use(http.get(me, () => HttpResponse.json(fakeAuthUser())))

function Crashing(): never {
  throw new Error('column "owner_id" does not exist')
}

/**
 * The test flips this between the crash and the retry. React may render a throwing tree twice, so the
 * component must not be the thing that decides when to stop crashing.
 */
const crashing = { value: true }
function CrashesWhileFlagged() {
  if (crashing.value) throw new Error('first render only')
  return <p>Recovered</p>
}

describe('the route table', () => {
  it('sends a visitor without a session from a signed-in page to sign-in', async () => {
    await renderApp(Routes.DATABASE)

    expect(await screen.findByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  it('opens a signed-in page inside the app chrome', async () => {
    signedIn()
    await renderApp(Routes.ACCOUNT)

    expect(await screen.findByRole('heading', { level: 1, name: 'Account' })).toBeInTheDocument()
    expect(screen.getByText('Web Showcase')).toBeVisible()
  })

  it('opens the first screen at the bare origin', async () => {
    signedIn()
    await renderApp(Routes.ROOT)

    expect(await screen.findByRole('heading', { level: 1, name: 'UI Components' })).toBeInTheDocument()
  })

  it('opens the first screen for a path the app does not have', async () => {
    signedIn()
    await renderApp('/no-such-page')

    expect(await screen.findByRole('heading', { level: 1, name: 'UI Components' })).toBeInTheDocument()
  })

  it('shows the error rather than the sign-in form when the session cannot be checked', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(http.get(me, () => new HttpResponse(null, { status: 500 })))
    await renderApp(Routes.DATABASE)

    expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument()
  })
})

describe.each([
  ['the app layout', Routes.DATABASE, 'features/database/DatabasePage.tsx'],
  ['the public layout', Routes.PRIVACY, 'features/privacy/PrivacyPage.tsx'],
])('a page crashing inside %s', (_layout, path, page) => {
  beforeEach(() => {
    crashing.value = true
    signedIn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('keeps the chrome and offers something the user can act on', async () => {
    await renderApp(path, { replace: { [page]: Crashing } })

    expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()
    expect(screen.getByText('Web Showcase')).toBeVisible()
  })

  it('never renders the thrown message', async () => {
    await renderApp(path, { replace: { [page]: Crashing } })

    await screen.findByRole('heading', { name: 'Something went wrong' })
    expect(screen.queryByText(/owner_id/)).not.toBeInTheDocument()
  })

  it('renders the page again on retry', async () => {
    await renderApp(path, { replace: { [page]: CrashesWhileFlagged } })
    await screen.findByRole('button', { name: 'Retry' })

    crashing.value = false
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByText('Recovered')).toBeVisible()
  })
})
