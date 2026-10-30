import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRoutesStub } from 'react-router'
import { queryClient } from '../shared/api/queryClient'
import { SnackbarProvider } from '../shared/components/feedback/Snackbar'
import { TooltipProvider } from '../shared/components/Tooltip'
import { ColorSchemeProvider } from '../shared/context/ColorSchemeProvider'
import { ConsentProvider } from '../shared/context/ConsentProvider'
import { LocaleProvider } from '../shared/context/LocaleProvider'
import { AuthProvider } from '../shared/context/AuthProvider'
import { AuthContext, type AuthContextValue } from '../shared/context/AuthContext'

type Options = Omit<RenderOptions, 'wrapper'> & {
  route?: string
  authValue?: AuthContextValue
  /** Wraps in the real AuthProvider so auth flows hit the network (MSW) — for integration tests. */
  useRealAuth?: boolean
}

/**
 * One component under the app's providers and a router of its own. For a page in its place in the route
 * table — guard, layout, boundary — render the app itself with `renderApp`.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', authValue, useRealAuth, ...options }: Options = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    const withAuth = useRealAuth ? (
      <AuthProvider>{children}</AuthProvider>
    ) : authValue ? (
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    ) : (
      children
    )
    return (
      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider>
          <TooltipProvider>
            <LocaleProvider>
              <ConsentProvider>
                <SnackbarProvider>{withAuth}</SnackbarProvider>
              </ConsentProvider>
            </LocaleProvider>
          </TooltipProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    )
  }

  const Stub = createRoutesStub([{ path: '*', Component: () => ui }])
  return render(<Stub initialEntries={[route]} />, { wrapper: Wrapper, ...options })
}

export function fakeAuthValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    deleteAccount: async () => {},
    updateThemeMode: async () => {},
    updateLocale: async () => {},
    ...overrides,
  }
}
