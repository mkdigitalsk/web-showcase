import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, fakeAuthValue, screen, userEvent } from '../../../test/test-utils'
import { LocaleSwitcher } from './LocaleSwitcher'

describe('LocaleSwitcher', () => {
  it('lists the available languages and calls updateLanguage on selection', async () => {
    const updateLanguage = vi.fn()
    renderWithProviders(<LocaleSwitcher />, { authValue: fakeAuthValue({ updateLanguage }) })

    await userEvent.click(screen.getByRole('button', { name: 'Change language' }))

    expect(await screen.findByRole('menuitem', { name: /English/ })).toBeVisible()
    await userEvent.click(screen.getByRole('menuitem', { name: /Slovenčina/ }))

    expect(updateLanguage).toHaveBeenCalledWith('SK')
  })
})
