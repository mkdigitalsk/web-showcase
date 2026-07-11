import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, fakeAuthValue } from '../../../test/renderWithProviders'
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
})
