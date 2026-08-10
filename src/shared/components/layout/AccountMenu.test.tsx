import { describe, it, expect, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { Routes as AppRoutes } from '../../../utils'
import { renderWithProviders, fakeAuthValue, fakeAuthUser, screen, userEvent } from '../../../test/test-utils'
import { AccountMenu } from './AccountMenu'

function renderMenu(overrides: Parameters<typeof fakeAuthValue>[0]) {
  return renderWithProviders(
    <Routes>
      <Route path={AppRoutes.ROOT} element={<AccountMenu />} />
      <Route path={AppRoutes.SIGN_IN} element={<div>Sign In Screen</div>} />
    </Routes>,
    {
      authValue: fakeAuthValue({
        user: fakeAuthUser({ email: 'test01@mkdigital.sk' }),
        isAuthenticated: true,
        ...overrides,
      }),
    },
  )
}

describe('AccountMenu', () => {
  it('shows the user initials on the avatar', () => {
    renderMenu({})

    expect(screen.getByText('TE')).toBeVisible()
  })

  it('logs out and navigates to the sign-in screen', async () => {
    const signOut = vi.fn().mockResolvedValue(undefined)
    renderMenu({ signOut })

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Sign Out' }))

    expect(signOut).toHaveBeenCalledOnce()
    expect(await screen.findByText('Sign In Screen')).toBeVisible()
  })

  it('updates the theme mode from the theme submenu', async () => {
    const updateThemeMode = vi.fn()
    renderMenu({ updateThemeMode })

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('menuitem', { name: /Theme/ }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Dark' }))

    expect(updateThemeMode).toHaveBeenCalledWith('dark')
  })
})
