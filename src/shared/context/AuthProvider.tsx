import { useColorScheme } from '@mui/material/styles'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { AuthUser, ThemeMode } from '../types'
import { sessionQueryOptions } from '../auth/session'
import { authService, clearLocalUserData, userService } from '../services'
import { useLocale } from '../hooks/useLocale'
import { DEFAULT_LOCALE } from '../i18n/locales'
import { AuthContext, type AuthContextValue } from './AuthContext'

/**
 * A preference sync is best-effort: the UI already reflects the change through its own setter, so a
 * refused write leaves it standing.
 */
const syncPreference = (write: Promise<AuthUser>, store: (user: AuthUser) => void) =>
  write.then(store).catch(() => undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const { data: user = null } = useQuery(sessionQueryOptions)
  const { setMode } = useColorScheme()
  const { setLocale } = useLocale()

  const storeUser = (signedIn: AuthUser) => queryClient.setQueryData(sessionQueryOptions.queryKey, signedIn)

  const startSession = (signedIn: AuthUser) => {
    storeUser(signedIn)
    setMode(signedIn.themeMode)
    setLocale(signedIn.locale)
  }

  const forgetThisDevice = async () => {
    await clearLocalUserData(queryClient)
    setMode('system')
    setLocale(DEFAULT_LOCALE)
  }

  const signIn = async (credentials: Parameters<typeof authService.signIn>[0]) => {
    startSession((await authService.signIn(credentials)).user)
  }

  const signUp = async (data: Parameters<typeof authService.signUp>[0]) => {
    startSession((await authService.signUp(data)).user)
  }

  const signOut = async () => {
    await authService.signOut()
    await forgetThisDevice()
  }

  const deleteAccount = async () => {
    await userService.deleteAccount()
    await authService.signOut().catch(() => undefined)
    await forgetThisDevice()
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
    signIn,
    signUp,
    signOut,
    deleteAccount,
    updateThemeMode,
    updateLocale,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
