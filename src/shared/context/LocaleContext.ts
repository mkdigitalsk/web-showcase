import { createContext } from 'react'
import type { Locale } from '../enums/locale'
import type { LocaleOption } from '../i18n/locales'

export interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  locales: LocaleOption[]
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
