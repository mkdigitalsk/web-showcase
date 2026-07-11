import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/renderWithProviders'
import { Input } from './Input'

describe('Input', () => {
  it('masks a password field by default and reveals it on toggle', async () => {
    renderWithProviders(<Input label="Password" type="password" />)

    const field = screen.getByLabelText('Password')
    expect(field).toHaveAttribute('type', 'password')

    await userEvent.click(screen.getByRole('button'))
    expect(field).toHaveAttribute('type', 'text')

    await userEvent.click(screen.getByRole('button'))
    expect(field).toHaveAttribute('type', 'password')
  })

  it('renders a plain text field without a reveal toggle', () => {
    renderWithProviders(<Input label="Email" type="text" />)

    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'text')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
