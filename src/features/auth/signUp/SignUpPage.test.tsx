import { describe, it, expect, vi } from 'vitest'
import { Route, Routes } from 'react-router'
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
import SignUpPage from './SignUpPage'

describe('SignUpPage', () => {
  it('flags the empty required fields on submit', async () => {
    const signUp = vi.fn()
    renderWithProviders(<SignUpPage />, { authValue: fakeAuthValue({ signUp }) })

    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    expect(await screen.findAllByText('This field is required')).toHaveLength(1)
    expect(signUp).not.toHaveBeenCalled()
  })

  it('rejects a password shorter than six characters', async () => {
    const signUp = vi.fn()
    renderWithProviders(<SignUpPage />, { authValue: fakeAuthValue({ signUp }) })
    await userEvent.type(screen.getByLabelText('Email'), 'dana@example.com')
    await userEvent.type(screen.getByLabelText('Password'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    expect(await screen.findByText('Password must be at least 6 characters')).toBeVisible()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('signs up and navigates to the app on valid input', async () => {
    renderWithProviders(
      <Routes>
        <Route path={AppRoutes.SIGN_UP} element={<SignUpPage />} />
        <Route path={AppRoutes.UI_COMPONENTS} element={<div>UI Components Page</div>} />
      </Routes>,
      { route: AppRoutes.SIGN_UP, useRealAuth: true },
    )
    await userEvent.type(screen.getByLabelText('Email'), 'dana@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'strong-pass')
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    expect(await screen.findByText('UI Components Page')).toBeVisible()
  })

  it('names the terms the account is created on and links them', () => {
    renderWithProviders(<SignUpPage />, { authValue: fakeAuthValue({ signUp: vi.fn() }) })

    expect(screen.getByText(/By creating an account you enter into a contract/)).toBeVisible()
    expect(screen.getByRole('link', { name: 'terms of use' })).toHaveAttribute('href', AppRoutes.TERMS)
  })

  it('names the controller, what it stores and why, and links the full privacy notice', () => {
    renderWithProviders(<SignUpPage />, { authValue: fakeAuthValue({ signUp: vi.fn() }) })

    expect(screen.getByText(/MK Digital s\. r\. o\. is responsible for your data/)).toBeVisible()
    expect(screen.getByRole('link', { name: 'full notice' })).toHaveAttribute('href', AppRoutes.PRIVACY)
  })

  it('surfaces an error when sign-up is rejected', async () => {
    server.use(http.post('*/v1/auth/sign-up', () => new HttpResponse(null, { status: 409 })))
    renderWithProviders(<SignUpPage />, { route: AppRoutes.SIGN_UP, useRealAuth: true })
    await userEvent.type(screen.getByLabelText('Email'), 'dana@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'strong-pass')
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    expect(await screen.findByText('Sign-up failed. Please try again.')).toBeVisible()
  })
})
