import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { AlertDialog } from './Dialog'

describe('AlertDialog', () => {
  it('renders nothing while closed', () => {
    renderWithProviders(
      <AlertDialog open={false} text="Delete this note?" onConfirm={() => {}} onDismiss={() => {}} />,
    )

    expect(screen.queryByText('Delete this note?')).not.toBeInTheDocument()
  })

  it('shows the title and text when open', () => {
    renderWithProviders(
      <AlertDialog open title="Delete" text="Delete this note?" onConfirm={() => {}} onDismiss={() => {}} />,
    )

    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByText('Delete this note?')).toBeVisible()
  })

  it('calls the matching callback for each action', async () => {
    const onConfirm = vi.fn()
    const onDismiss = vi.fn()
    renderWithProviders(
      <AlertDialog
        open
        text="Delete this note?"
        confirmText="Delete"
        dismissText="Keep"
        onConfirm={onConfirm}
        onDismiss={onDismiss}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onDismiss).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Keep' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
