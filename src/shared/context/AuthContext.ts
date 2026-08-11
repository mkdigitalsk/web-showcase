import { createContext } from 'react'
import type { AuthUser, SignInRequest, SignUpRequest, ThemeMode } from '../types'

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (credentials: SignInRequest) => Promise<void>
  signUp: (data: SignUpRequest) => Promise<void>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
  updateThemeMode: (themeMode: ThemeMode) => Promise<void>
  updateLocale: (locale: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
