import { createContext } from 'react'
import type { AuthUser, LoginRequest, RegisterRequest, ThemeMode } from '../types'

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  updateThemeMode: (themeMode: ThemeMode) => Promise<void>
  updateLocale: (locale: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
