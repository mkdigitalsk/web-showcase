import { useEffect } from 'react'
import type { Locale } from '../enums/locale'

/**
 * Writes the locale onto `<html>` as `lang`, the language a screen reader voices the page in.
 * [WCAG 2.2 — Understanding SC 3.1.1 Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)
 */
export function useDocumentLanguage(locale: Locale) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
}
