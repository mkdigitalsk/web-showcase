import { useColorScheme } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { z } from 'zod'
import type { AuthUser, ThemeMode } from '../types'
import { authService, clearLocalUserData, userService } from '../services'
import { StorageKey } from '../enums/storageKey'
import { useLocale } from '../hooks/useLocale'
import { DEFAULT_LOCALE } from '../i18n/locales'
import { AuthContext, type AuthContextValue } from './AuthContext'

// Another tab or a stale release can leave anything under this key.
const storedUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  themeMode: z.enum(['system', 'light', 'dark']),
  locale: z.string(),
  demo: z.boolean().default(false),
}) satisfies z.ZodType<AuthUser>

function getStoredUser(): AuthUser | null {
  const token = localStorage.getItem(StorageKey.TOKEN)
  const storedUser = localStorage.getItem(StorageKey.USER)
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
  const queryClient = useQueryClient()

  const signIn = async (credentials: Parameters<typeof authService.signIn>[0]) => {
    const response = await authService.signIn(credentials)
    localStorage.setItem(StorageKey.TOKEN, response.token)
    localStorage.setItem(StorageKey.USER, JSON.stringify(response.user))
    setUser(response.user)
    setMode(response.user.themeMode)
    setLocale(response.user.locale)
  }

  const signUp = async (data: Parameters<typeof authService.signUp>[0]) => {
    const response = await authService.signUp(data)
    localStorage.setItem(StorageKey.TOKEN, response.token)
    localStorage.setItem(StorageKey.USER, JSON.stringify(response.user))
    setUser(response.user)
    setMode(response.user.themeMode)
    setLocale(response.user.locale)
  }

  const signOut = async () => {
    await clearLocalUserData(queryClient)
    setUser(null)
    setMode('system')
    setLocale(DEFAULT_LOCALE)
  }

  // The call goes first, while the token clearing it away is still there to authorize it. Once the
  // server answers, the account is gone — a local store that will not clear cannot turn that into
  // "deletion failed" and park the person on an account that no longer exists.
  const deleteAccount = async () => {
    await userService.deleteAccount()
    await signOut().catch(() => undefined)
  }

  const updateThemeMode = async (themeMode: ThemeMode) => {
    setMode(themeMode)
    // The toggle rides in the top bar, which public pages render too. With nobody signed in there is
    // nothing to save it against, and the request would 401 into the interceptor's hard reload.
    if (!user) return
    try {
      const updatedUser = await userService.updateThemeMode(themeMode)
      localStorage.setItem(StorageKey.USER, JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch {
      // Theme preference sync is best-effort — UI already reflects the change via setMode.
    }
  }

  const updateLocale = async (locale: string) => {
    setLocale(locale)
    try {
      const updatedUser = await userService.updateLocale(locale)
      localStorage.setItem(StorageKey.USER, JSON.stringify(updatedUser))
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
    deleteAccount,
    updateThemeMode,
    updateLocale,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
