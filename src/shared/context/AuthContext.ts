import { createContext } from 'react'
import type { AuthUser, SignInRequest, SignUpRequest, ThemeMode } from '../types'

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (credentials: SignInRequest) => Promise<void>
  signUp: (data: SignUpRequest) => Promise<void>
  signOut: () => Promise<void>
  /**
   * The server call goes first, while the token clearing it away is still there to authorize it. Once
   * the server answers, the account is gone — a local store that will not clear cannot turn that into
   * "deletion failed" and park the person on an account that no longer exists.
   */
  deleteAccount: () => Promise<void>
  /**
   * Applies the mode at once and saves it to the account only when somebody is signed in — the toggle
   * rides in the top bar, which public pages render too, and with nobody to save it against the
   * request would 401 into the interceptor's hard reload.
   */
  updateThemeMode: (themeMode: ThemeMode) => Promise<void>
  updateLocale: (locale: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
