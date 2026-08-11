import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, userEvent } from '../../test/test-utils'
import { Input } from './Input'

// The toggle is an icon-only button, so its accessible name is the only thing a screen reader has to
// go on — and jsx-a11y cannot see it, because it does not know MUI's IconButton renders a <button>.
describe('Input password toggle', () => {
  it('names the action it will perform, and renames itself once performed', async () => {
    renderWithProviders(<Input type="password" label="Password" />)

    const toggle = screen.getByRole('button', { name: 'Show password' })
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')

    await userEvent.click(toggle)

    expect(screen.getByRole('button', { name: 'Hide password' })).toBeVisible()
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
  })

  it('has no toggle on a field that is not a password', () => {
    renderWithProviders(<Input type="text" label="Email" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
