import { createContext } from 'react'
import type { ThemeMode } from '../types'

export type ColorScheme = 'light' | 'dark'

export interface ColorSchemeContextValue {
  /** The account's choice — system, or one scheme. */
  mode: ThemeMode
  /** What the device prefers; unknown where the browser does not say. */
  systemMode: ColorScheme | undefined
  /** The scheme in effect — the mode, or the system's where the mode follows it. */
  scheme: ColorScheme | undefined
  setMode: (mode: ThemeMode) => void
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null)
