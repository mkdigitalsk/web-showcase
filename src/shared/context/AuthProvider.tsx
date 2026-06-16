import { useColorScheme } from '@mui/material/styles'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser, ThemeMode } from '../types'
import { authService, userService } from '../services'
import { useLocale } from '../hooks/useLocale'
import { DEFAULT_LOCALE } from '../i18n/locales'
import { AuthContext, type AuthContextValue } from './AuthContext'

function getStoredUser(): AuthUser | null {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  if (token && storedUser) {
    return JSON.parse(storedUser)
  }
  return null
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)
  const { setMode } = useColorScheme()
  const { setLocale } = useLocale()

  const login = async (credentials: Parameters<typeof authService.login>[0]) => {
    const response = await authService.login(credentials)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
    setMode(response.user.themeMode)
    setLocale(response.user.locale)
  }

  const register = async (data: Parameters<typeof authService.register>[0]) => {
    const response = await authService.register(data)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
    setMode(response.user.themeMode)
    setLocale(response.user.locale)
  }

  const logout = async () => {
    await authService.logout()
    localStorage.removeItem('user')
    setUser(null)
    setMode('system')
    setLocale(DEFAULT_LOCALE)
  }

  const updateThemeMode = async (themeMode: ThemeMode) => {
    setMode(themeMode)
    try {
      const updatedUser = await userService.updateThemeMode(themeMode)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch {
      // Theme preference sync is best-effort — UI already reflects the change via setMode.
    }
  }

  const updateLocale = async (locale: string) => {
    setLocale(locale)
    try {
      const updatedUser = await userService.updateLocale(locale)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch {
      // Locale preference sync is best-effort — UI already reflects the change via setLocale.
    }
  }

  const value: AuthContextValue = {
    user,
    isLoading: false,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateThemeMode,
    updateLocale,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
