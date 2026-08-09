import { useColorScheme } from '@mui/material/styles'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { z } from 'zod'
import type { AuthUser, ThemeMode } from '../types'
import { authService, userService } from '../services'
import { useLocale } from '../hooks/useLocale'
import { DEFAULT_LOCALE } from '../i18n/locales'
import { AuthContext, type AuthContextValue } from './AuthContext'

// Another tab or a stale release can leave anything under this key.
const storedUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  themeMode: z.enum(['system', 'light', 'dark']),
  locale: z.string(),
}) satisfies z.ZodType<AuthUser>

function getStoredUser(): AuthUser | null {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  if (!token || !storedUser) return null

  try {
    const raw: unknown = JSON.parse(storedUser)
    const parsed = storedUserSchema.safeParse(raw)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)
  const { setMode } = useColorScheme()
  const { setLocale } = useLocale()

  const signIn = async (credentials: Parameters<typeof authService.signIn>[0]) => {
    const response = await authService.signIn(credentials)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
    setMode(response.user.themeMode)
    setLocale(response.user.locale)
  }

  const signUp = async (data: Parameters<typeof authService.signUp>[0]) => {
    const response = await authService.signUp(data)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
    setMode(response.user.themeMode)
    setLocale(response.user.locale)
  }

  const signOut = async () => {
    await authService.signOut()
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
    signIn,
    signUp,
    signOut,
    updateThemeMode,
    updateLocale,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
