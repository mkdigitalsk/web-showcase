import { describe, it, expect, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders, fakeAuthValue, screen, userEvent, server, http, HttpResponse } from '../../../test/test-utils'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('blocks submission and flags required fields when empty', async () => {
    const login = vi.fn()
    renderWithProviders(<LoginPage />, { authValue: fakeAuthValue({ login }) })

    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findAllByText('This field is required')).toHaveLength(2)
    expect(login).not.toHaveBeenCalled()
  })

  it('fills the credentials from the test-account shortcut', async () => {
    renderWithProviders(<LoginPage />, { authValue: fakeAuthValue() })

    await userEvent.click(screen.getByRole('button', { name: 'Fill test account' }))

    expect(screen.getByLabelText('Email')).toHaveValue('test01@mkdigital.sk')
    expect(screen.getByLabelText('Password')).toHaveValue('MKDigitalTest1@')
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
  })

  it('signs in and navigates to the app on valid credentials', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ui-components" element={<div>UI Components Page</div>} />
      </Routes>,
      { route: '/login', useRealAuth: true },
    )

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'MKDigitalTest1@')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('UI Components Page')).toBeVisible()
    expect(localStorage.getItem('token')).toBe('fake.jwt.token')
  })

  it('shows an error message when the credentials are rejected', async () => {
    server.use(http.post('*/v1/auth/login', () => new HttpResponse(null, { status: 401 })))
    renderWithProviders(<LoginPage />, { route: '/login', useRealAuth: true })

    await userEvent.type(screen.getByLabelText('Email'), 'test01@mkdigital.sk')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Invalid email or password')).toBeVisible()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
