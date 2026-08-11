import { describe, it, expect } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { Routes as AppRoutes } from '../../../utils'
import { renderWithProviders, fakeAuthValue, fakeAuthUser, screen, userEvent } from '../../../test/test-utils'
import { AccountMenu } from './AccountMenu'

function renderAvatar() {
  return renderWithProviders(
    <Routes>
      <Route path={AppRoutes.ROOT} element={<AccountMenu />} />
      <Route path={AppRoutes.ACCOUNT} element={<div>Account Screen</div>} />
    </Routes>,
    {
      authValue: fakeAuthValue({
        user: fakeAuthUser({ email: 'test01@mkdigital.sk' }),
        isAuthenticated: true,
      }),
    },
  )
}

describe('AccountMenu', () => {
  it('shows the user initials on the avatar', () => {
    renderAvatar()

    expect(screen.getByText('TE')).toBeVisible()
  })

  it('opens the account screen in one click', async () => {
    renderAvatar()

    await userEvent.click(screen.getByRole('button', { name: 'Account' }))

    expect(await screen.findByText('Account Screen')).toBeVisible()
  })
})
