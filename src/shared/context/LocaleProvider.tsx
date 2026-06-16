import type { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Locale } from '../enums/locale'
import { DEFAULT_LOCALE, LOCALES, messagesFor } from '../i18n/locales'
import { LocaleContext } from './LocaleContext'

/**
 * Owns the active UI language: persists it (localStorage so it survives browser
 * restarts) and feeds the right message bundle into react-intl. Components read
 * it via `useLocale` — they never touch IntlProvider or storage directly (DIP).
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>('locale', DEFAULT_LOCALE)

  return (
    <LocaleContext.Provider value={{ locale, setLocale, locales: LOCALES }}>
      <IntlProvider locale={locale} defaultLocale={DEFAULT_LOCALE} messages={messagesFor(locale)}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}
