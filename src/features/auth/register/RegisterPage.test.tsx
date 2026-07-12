import { describe, it, expect, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders, fakeAuthValue, screen, userEvent, server, http, HttpResponse } from '../../../test/test-utils'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage', () => {
  it('flags the empty required fields on submit', async () => {
    const register = vi.fn()
    renderWithProviders(<RegisterPage />, { authValue: fakeAuthValue({ register }) })

    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findAllByText('This field is required')).toHaveLength(2)
    expect(register).not.toHaveBeenCalled()
  })

  it('rejects a password shorter than six characters', async () => {
    const register = vi.fn()
    renderWithProviders(<RegisterPage />, { authValue: fakeAuthValue({ register }) })

    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText('Email'), 'alice@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Password must be at least 6 characters')).toBeVisible()
    expect(register).not.toHaveBeenCalled()
  })

  it('registers and navigates to the app on valid input', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ui-components" element={<div>UI Components Page</div>} />
      </Routes>,
      { route: '/register', useRealAuth: true },
    )

    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText('Email'), 'alice@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'strong-pass')
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('UI Components Page')).toBeVisible()
    expect(localStorage.getItem('token')).toBe('fake.jwt.token')
  })

  it('surfaces an error when registration is rejected', async () => {
    server.use(http.post('*/v1/auth/register', () => new HttpResponse(null, { status: 409 })))
    renderWithProviders(<RegisterPage />, { route: '/register', useRealAuth: true })

    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText('Email'), 'taken@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'strong-pass')
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Registration failed. Please try again.')).toBeVisible()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
