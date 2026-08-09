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
import { SignUpPage } from './SignUpPage'

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
    await userEvent.type(screen.getByLabelText('Email'), 'alice@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    expect(await screen.findByText('Password must be at least 6 characters')).toBeVisible()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('signs up and navigates to the app on valid input', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/ui-components" element={<div>UI Components Page</div>} />
      </Routes>,
      { route: '/signUp', useRealAuth: true },
    )
    await userEvent.type(screen.getByLabelText('Email'), 'alice@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'strong-pass')
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    expect(await screen.findByText('UI Components Page')).toBeVisible()
    expect(localStorage.getItem('token')).toBe('fake.jwt.token')
  })

  it('surfaces an error when sign-up is rejected', async () => {
    server.use(http.post('*/v1/auth/sign-up', () => new HttpResponse(null, { status: 409 })))
    renderWithProviders(<SignUpPage />, { route: '/signUp', useRealAuth: true })
    await userEvent.type(screen.getByLabelText('Email'), 'taken@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'strong-pass')
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    expect(await screen.findByText('Sign-up failed. Please try again.')).toBeVisible()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
