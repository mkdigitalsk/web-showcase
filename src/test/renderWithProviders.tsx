import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { theme } from '../shared/theme'
import { LocaleProvider } from '../shared/context/LocaleProvider'
import { AuthProvider } from '../shared/context/AuthProvider'
import { AuthContext, type AuthContextValue } from '../shared/context/AuthContext'

type Options = Omit<RenderOptions, 'wrapper'> & {
  route?: string
  authValue?: AuthContextValue
  // Wrap in the real AuthProvider so auth flows hit the network (MSW) — for integration tests.
  useRealAuth?: boolean
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', authValue, useRealAuth, ...options }: Options = {},
) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })

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
        <ThemeProvider theme={theme}>
          <LocaleProvider>
            <MemoryRouter initialEntries={[route]}>{withAuth}</MemoryRouter>
          </LocaleProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

export function fakeAuthValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    deleteAccount: async () => {},
    updateThemeMode: async () => {},
    updateLocale: async () => {},
    ...overrides,
  }
}
