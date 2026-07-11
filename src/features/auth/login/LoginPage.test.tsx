import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, fakeAuthValue } from '../../../test/renderWithProviders'
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
})
