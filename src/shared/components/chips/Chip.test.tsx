import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen, userEvent } from '../../../test/test-utils'
import { Chip } from './Chip'

/** The remove button is glyph-only, so its accessible name is the whole of what a screen reader gets. */
describe('Chip', () => {
  it('ends in a remove button its label names, and the press reaches the caller', async () => {
    const onDelete = vi.fn()
    renderWithProviders(<Chip label="Groceries" onDelete={onDelete} deleteLabel="Remove Groceries" />)

    await userEvent.click(screen.getByRole('button', { name: 'Remove Groceries' }))

    expect(onDelete).toHaveBeenCalledOnce()
  })

  it('carries no button when nothing removes it', () => {
    renderWithProviders(<Chip label="Groceries" />)

    expect(screen.getByText('Groceries')).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
