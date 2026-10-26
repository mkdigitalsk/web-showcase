import type { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { useDocumentLanguage } from '../hooks/useDocumentLanguage'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Locale } from '../enums/locale'
import { DEFAULT_LOCALE, LOCALES, messagesFor, offeredLocale } from '../i18n/locales'
import { LocaleContext } from './LocaleContext'

export const LOCALE_STORAGE_KEY = 'locale'

/**
 * Owns the active UI language: persists it (localStorage so it survives browser
 * restarts) and feeds the right message bundle into react-intl. Components read
 * it via `useLocale` — they never touch IntlProvider or storage directly (DIP).
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [stored, setLocale] = useLocalStorage<Locale>(LOCALE_STORAGE_KEY, DEFAULT_LOCALE)
  const locale = offeredLocale(stored)
  useDocumentLanguage(locale)

  return (
    <LocaleContext.Provider value={{ locale, setLocale, locales: LOCALES }}>
      <IntlProvider locale={locale} defaultLocale={DEFAULT_LOCALE} messages={messagesFor(locale)}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}
