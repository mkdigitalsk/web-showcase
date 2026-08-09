import { describe, it, expect, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
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
        <Route path="/signIn" element={<SignInPage />} />
        <Route path="/ui-components" element={<div>UI Components Page</div>} />
      </Routes>,
      { route: '/signIn', useRealAuth: true },
    )

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'MKDigitalTest1@')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText('UI Components Page')).toBeVisible()
    expect(localStorage.getItem('token')).toBe('fake.jwt.token')
  })

  it('shows an error message when the credentials are rejected', async () => {
    server.use(http.post('*/v1/auth/sign-in', () => new HttpResponse(null, { status: 401 })))
    renderWithProviders(<SignInPage />, { route: '/signIn', useRealAuth: true })

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText('Invalid email or password')).toBeVisible()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('separates an unreachable server from a rejected credential', async () => {
    server.use(http.post('*/v1/auth/sign-in', () => HttpResponse.error()))
    renderWithProviders(<SignInPage />, { route: '/signIn', useRealAuth: true })

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'MKDigitalTest1@')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText(/Can’t reach the server/)).toBeVisible()
    expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument()
  })
})
