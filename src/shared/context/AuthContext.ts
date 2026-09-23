import { createContext } from 'react'
import type { AuthUser, SignInRequest, SignUpRequest, ThemeMode } from '../types'

export interface AuthContextValue {
  user: AuthUser | null
  signIn: (credentials: SignInRequest) => Promise<void>
  signUp: (data: SignUpRequest) => Promise<void>
  /** The session cookie is gone before this device's data goes, so a refusal leaves the person signed in. */
  signOut: () => Promise<void>
  /**
   * The server call goes first, while the session clearing it away is still there to authorize it. Once
   * the server answers, the account is gone — neither a proxy that will not end the session nor a local store
   * that will not clear can turn that into "deletion failed" and park the person on an account that no
   * longer exists.
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
