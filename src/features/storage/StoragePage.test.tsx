import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, userEvent } from '../../test/test-utils'
import StoragePage from './StoragePage'

/** The Session card renders first in DOM order. */
const SESSION_CARD = 0
/** The Persistent card renders second in DOM order. */
const PERSISTENT_CARD = 1

/** Says which card is missing instead of failing on `undefined` several lines later. */
function icon(name: string, card: number): HTMLElement {
  const found = screen.getAllByTestId(name)[card]
  if (!found) throw new Error(`no ${name} at index ${card} — the page rendered ${screen.getAllByTestId(name).length}`)
  return found
}

describe('StoragePage', () => {
  it('names itself with a heading', () => {
    renderWithProviders(<StoragePage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Storage' })).toBeInTheDocument()
  })

  it('increments the session counter and persists it to sessionStorage', async () => {
    renderWithProviders(<StoragePage />)

    await userEvent.click(icon('AddIcon', SESSION_CARD))

    expect(screen.getByText('1')).toBeVisible()
    expect(sessionStorage.getItem('storage.sessionCounter')).toBe('1')
  })

  it('increments the persistent counter and persists it to localStorage', async () => {
    renderWithProviders(<StoragePage />)

    await userEvent.click(icon('AddIcon', PERSISTENT_CARD))

    expect(screen.getByText('1')).toBeVisible()
    expect(localStorage.getItem('storage.persistentCounter')).toBe('1')
  })

  it('decrements below zero', async () => {
    renderWithProviders(<StoragePage />)

    await userEvent.click(icon('RemoveIcon', SESSION_CARD))

    expect(screen.getByText('-1')).toBeVisible()
    expect(sessionStorage.getItem('storage.sessionCounter')).toBe('-1')
  })

  it('clears the session counter back to zero', async () => {
    renderWithProviders(<StoragePage />)

    await userEvent.click(icon('AddIcon', SESSION_CARD))
    expect(screen.getByText('1')).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Clear this tab' }))

    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(sessionStorage.getItem('storage.sessionCounter')).toBeNull()
  })
})
