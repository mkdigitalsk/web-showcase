import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, userEvent } from '../../test/test-utils'
import { StoragePage } from './StoragePage'

// AddIcon[0]/RemoveIcon[0] belong to the Session card, [1] to the Persistent card (DOM order).
describe('StoragePage', () => {
  it('increments the session counter and persists it to sessionStorage', async () => {
    renderWithProviders(<StoragePage />)

    await userEvent.click(screen.getAllByTestId('AddIcon')[0])

    expect(screen.getByText('1')).toBeVisible()
    expect(sessionStorage.getItem('storage.sessionCounter')).toBe('1')
  })

  it('increments the persistent counter and persists it to localStorage', async () => {
    renderWithProviders(<StoragePage />)

    await userEvent.click(screen.getAllByTestId('AddIcon')[1])

    expect(screen.getByText('1')).toBeVisible()
    expect(localStorage.getItem('storage.persistentCounter')).toBe('1')
  })

  it('decrements below zero', async () => {
    renderWithProviders(<StoragePage />)

    await userEvent.click(screen.getAllByTestId('RemoveIcon')[0])

    expect(screen.getByText('-1')).toBeVisible()
    expect(sessionStorage.getItem('storage.sessionCounter')).toBe('-1')
  })

  it('clears the session counter back to zero', async () => {
    renderWithProviders(<StoragePage />)

    await userEvent.click(screen.getAllByTestId('AddIcon')[0])
    expect(screen.getByText('1')).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Clear Session' }))

    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(sessionStorage.getItem('storage.sessionCounter')).toBeNull()
  })
})
