import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, fakeAuthValue, screen, userEvent } from '../../../test/test-utils'
import { LocaleSwitcher } from './LocaleSwitcher'

describe('LocaleSwitcher', () => {
  it('lists the available languages and calls updateLocale on selection', async () => {
    const updateLocale = vi.fn()
    renderWithProviders(<LocaleSwitcher />, { authValue: fakeAuthValue({ updateLocale }) })

    await userEvent.click(screen.getByRole('button', { name: 'Change language' }))

    expect(screen.getByRole('menuitem', { name: /English/ })).toBeVisible()
    await userEvent.click(screen.getByRole('menuitem', { name: /Slovenčina/ }))

    expect(updateLocale).toHaveBeenCalledWith('sk-SK')
  })
})
