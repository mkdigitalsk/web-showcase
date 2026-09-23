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

/** Another tab or a stale release can leave anything under this key. */
const storedUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  themeMode: z.enum(['system', 'light', 'dark']),
  locale: z.string(),
  demo: z.boolean().default(false),
}) satisfies z.ZodType<AuthUser>

/**
 * A preference sync is best-effort: the UI already reflects the change through its own setter, so a
 * refused write leaves it standing.
 */
const syncPreference = (write: Promise<AuthUser>, store: (user: AuthUser) => void) =>
  write.then(store).catch(() => undefined)

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

  const deleteAccount = async () => {
    await userService.deleteAccount()
    await signOut().catch(() => undefined)
  }

  const storeUser = (updatedUser: AuthUser) => {
    localStorage.setItem(StorageKey.USER, JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const updateThemeMode = async (themeMode: ThemeMode) => {
    setMode(themeMode)
    if (!user) return
    await syncPreference(userService.updateThemeMode(themeMode), storeUser)
  }

  const updateLocale = async (locale: string) => {
    setLocale(locale)
    await syncPreference(userService.updateLocale(locale), storeUser)
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
