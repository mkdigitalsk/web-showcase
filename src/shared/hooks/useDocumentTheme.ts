import { useEffect } from 'react'
import type { ThemeMode } from '../types'

/** Writes the mode onto `<html>` as `data-theme`, the attribute the stylesheet's `color-scheme` switches on. */
export function useDocumentTheme(mode: ThemeMode) {
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'system') delete root.dataset.theme
    else root.dataset.theme = mode
  }, [mode])
}
