import { describe, it, expect } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders, fakeAuthValue, screen } from '../../test/test-utils'
import { PrivateRoute } from './PrivateRoute'

function renderGuarded(authValue: ReturnType<typeof fakeAuthValue>) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<div>Login Screen</div>} />
      <Route element={<PrivateRoute />}>
        <Route path="/secret" element={<div>Secret Content</div>} />
      </Route>
    </Routes>,
    { route: '/secret', authValue },
  )
}

describe('PrivateRoute', () => {
  it('redirects an unauthenticated visitor to the login screen', () => {
    renderGuarded(fakeAuthValue({ isAuthenticated: false }))

    expect(screen.getByText('Login Screen')).toBeVisible()
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument()
  })

  it('renders the guarded content for an authenticated user', () => {
    renderGuarded(fakeAuthValue({ isAuthenticated: true }))

    expect(screen.getByText('Secret Content')).toBeVisible()
  })
})
