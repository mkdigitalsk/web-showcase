import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderWithProviders, fakeAuthValue, fakeAuthUser, screen, userEvent } from '../../../test/test-utils'
import type { ThemeMode } from '../../types'
import { ThemeModeToggle } from './ThemeModeToggle'

function renderToggle(updateThemeMode: (themeMode: ThemeMode) => Promise<void>) {
  return renderWithProviders(<ThemeModeToggle />, {
    authValue: fakeAuthValue({ user: fakeAuthUser(), isAuthenticated: true, updateThemeMode }),
  })
}

afterEach(() => {
  localStorage.removeItem('mui-mode')
})

describe('ThemeModeToggle', () => {
  it('leaves the system and picks the opposite of what the system resolved to', async () => {
    const updateThemeMode = vi.fn().mockResolvedValue(undefined)
    renderToggle(updateThemeMode)

    await userEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))

    expect(updateThemeMode).toHaveBeenCalledWith('dark')
  })

  it('returns to following the system once a mode has been chosen', async () => {
    localStorage.setItem('mui-mode', 'dark')
    const updateThemeMode = vi.fn().mockResolvedValue(undefined)
    renderToggle(updateThemeMode)

    await userEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))

    expect(updateThemeMode).toHaveBeenCalledWith('system')
  })
})
