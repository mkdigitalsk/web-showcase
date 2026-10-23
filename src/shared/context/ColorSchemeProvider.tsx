import type { ReactNode } from 'react'
import { useDocumentTheme } from '../hooks/useDocumentTheme'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSystemScheme } from '../hooks/useSystemScheme'
import type { ThemeMode } from '../types'
import { ColorSchemeContext } from './ColorSchemeContext'

/** Where the mode is kept between visits — the root's pre-hydration script reads the same key. */
export const THEME_MODE_STORAGE_KEY = 'theme-mode'

/**
 * Owns the colour scheme: the mode persists per browser, `<html>` carries it as `data-theme` for the stylesheet's
 * `color-scheme` switch, and the system's preference resolves a mode that follows it.
 */
export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useLocalStorage<ThemeMode>(THEME_MODE_STORAGE_KEY, 'system')
  const systemMode = useSystemScheme()
  useDocumentTheme(mode)

  const scheme = mode === 'system' ? systemMode : mode

  return (
    <ColorSchemeContext.Provider value={{ mode, systemMode, scheme, setMode }}>{children}</ColorSchemeContext.Provider>
  )
}
