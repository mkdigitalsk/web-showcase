import { describe, it, expect, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
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
import { SignInPage } from './SignInPage'

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
    expect(localStorage.getItem('token')).toBe('fake.jwt.token')
  })

  it('shows an error message when the credentials are rejected', async () => {
    server.use(http.post('*/v1/auth/sign-in', () => new HttpResponse(null, { status: 401 })))
    renderWithProviders(<SignInPage />, { route: AppRoutes.SIGN_IN, useRealAuth: true })

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText('Invalid email or password')).toBeVisible()
    expect(localStorage.getItem('token')).toBeNull()
  })

  // The 401 interceptor answers an expired session by clearing the token and loading the sign-in
  // document, which discards this error before it can be read. A rejected credential is not that.
  it('keeps the session when it is the sign-in itself that is rejected', async () => {
    localStorage.setItem('token', 'still.valid.token')
    server.use(http.post('*/v1/auth/sign-in', () => new HttpResponse(null, { status: 401 })))
    renderWithProviders(<SignInPage />, { route: AppRoutes.SIGN_IN, useRealAuth: true })

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText('Invalid email or password')).toBeVisible()
    expect(localStorage.getItem('token')).toBe('still.valid.token')
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
