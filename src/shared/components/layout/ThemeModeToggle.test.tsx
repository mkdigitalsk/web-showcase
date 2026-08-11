import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  renderWithProviders,
  fakeAuthValue,
  fakeAuthUser,
  screen,
  userEvent,
  server,
  http,
  HttpResponse,
} from '../../../test/test-utils'
import { API_PREFIX } from '../../api/apiVersion'
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
  it('does not reach the server when nobody is signed in', async () => {
    let called = false
    server.use(
      http.put(`*${API_PREFIX}/users/me/theme-mode`, () => {
        called = true
        return new HttpResponse(null, { status: 401 })
      }),
    )
    renderWithProviders(<ThemeModeToggle />, { useRealAuth: true })

    await userEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))

    expect(called).toBe(false)
  })

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
