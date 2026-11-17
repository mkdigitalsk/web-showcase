import { describe, it, expect, vi } from 'vitest'
import { Route, Routes } from 'react-router'
import { LocaleSwitcher } from '../../../shared/components/layout/LocaleSwitcher'
import { LOCALE_STORAGE_KEY } from '../../../shared/context/LocaleProvider'
import { Locale } from '../../../shared/enums/locale'
import { Routes as AppRoutes } from '../../../utils'
import {
  renderWithProviders,
  fakeAuthValue,
  screen,
  userEvent,
  server,
  http,
  HttpResponse,
} from '../../../test/test-utils'
import SignInPage from './SignInPage'

/** The sign-in page, the language switcher behind it, and a server that answers the sign-in with this language. */
function renderSignInAnswering(language: { language?: string }) {
  server.use(
    http.post('*/v1/auth/sign-in', () =>
      HttpResponse.json({ user: { id: 1, email: 'dana@example.com', themeMode: 'system', ...language } }),
    ),
  )
  renderWithProviders(
    <Routes>
      <Route path={AppRoutes.SIGN_IN} element={<SignInPage />} />
      <Route path={AppRoutes.UI_COMPONENTS} element={<LocaleSwitcher />} />
    </Routes>,
    { route: AppRoutes.SIGN_IN, useRealAuth: true },
  )
}

describe('SignInPage', () => {
  it('blocks submission and flags required fields when empty', async () => {
    const signIn = vi.fn()
    renderWithProviders(<SignInPage />, { authValue: fakeAuthValue({ signIn }) })

    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findAllByText('This field is required')).toHaveLength(2)
    expect(signIn).not.toHaveBeenCalled()
  })

  it('fills the credentials from the test-account shortcut', async () => {
    renderWithProviders(<SignInPage />, { authValue: fakeAuthValue() })

    await userEvent.click(screen.getByRole('button', { name: 'Fill test account' }))

    expect(screen.getByLabelText('Email')).toHaveValue('test01@mkdigital.sk')
    expect(screen.getByLabelText('Password')).toHaveValue('MKDigitalTest1@')
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
  })

  it('signs in and navigates to the app on valid credentials', async () => {
    renderWithProviders(
      <Routes>
        <Route path={AppRoutes.SIGN_IN} element={<SignInPage />} />
        <Route path={AppRoutes.UI_COMPONENTS} element={<div>UI Components Page</div>} />
      </Routes>,
      { route: AppRoutes.SIGN_IN, useRealAuth: true },
    )

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'MKDigitalTest1@')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText('UI Components Page')).toBeVisible()
  })

  it('opens the session in the account’s language', async () => {
    renderSignInAnswering({ language: 'SK' })

    await userEvent.type(screen.getByLabelText('Email'), 'dana@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'Example-Password-1')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByRole('button', { name: 'Zmeniť jazyk' })).toBeVisible()
  })

  it.each([
    ['is one the showcase does not ship', { language: 'FR' }],
    ['is named by no key', {}],
  ])('opens the session in English when the account’s language %s', async (_, language) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(Locale.SK_SK))
    renderSignInAnswering(language)

    await userEvent.type(screen.getByLabelText('Email'), 'dana@example.com')
    await userEvent.type(screen.getByLabelText('Heslo'), 'Example-Password-1')
    await userEvent.click(screen.getByRole('button', { name: 'Prihlásiť sa' }))

    expect(await screen.findByRole('button', { name: 'Change language' })).toBeVisible()
  })

  it('shows an error message when the credentials are rejected', async () => {
    server.use(http.post('*/v1/auth/sign-in', () => new HttpResponse(null, { status: 401 })))
    renderWithProviders(<SignInPage />, { route: AppRoutes.SIGN_IN, useRealAuth: true })

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText('Invalid email or password')).toBeVisible()
  })

  it('separates an unreachable server from a rejected credential', async () => {
    server.use(http.post('*/v1/auth/sign-in', () => HttpResponse.error()))
    renderWithProviders(<SignInPage />, { route: AppRoutes.SIGN_IN, useRealAuth: true })

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'MKDigitalTest1@')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText(/Can’t reach the server/)).toBeVisible()
    expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument()
  })
})
