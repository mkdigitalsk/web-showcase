import { describe, it, expect } from 'vitest'
import { Routes as AppRoutes } from '../../utils'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders, fakeAuthValue, screen } from '../../test/test-utils'
import { PrivateRoute } from './PrivateRoute'

function renderGuarded(authValue: ReturnType<typeof fakeAuthValue>) {
  return renderWithProviders(
    <Routes>
      <Route path={AppRoutes.SIGN_IN} element={<div>Sign In Screen</div>} />
      <Route element={<PrivateRoute />}>
        <Route path={AppRoutes.DATABASE} element={<div>Guarded Content</div>} />
      </Route>
    </Routes>,
    { route: AppRoutes.DATABASE, authValue },
  )
}

describe('PrivateRoute', () => {
  it('redirects an unauthenticated visitor to the sign-in screen', () => {
    renderGuarded(fakeAuthValue({ isAuthenticated: false }))

    expect(screen.getByText('Sign In Screen')).toBeVisible()
    expect(screen.queryByText('Guarded Content')).not.toBeInTheDocument()
  })

  it('renders the guarded content for an authenticated user', () => {
    renderGuarded(fakeAuthValue({ isAuthenticated: true }))

    expect(screen.getByText('Guarded Content')).toBeVisible()
  })
})
