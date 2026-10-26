import enMessages from '../../locales/en.json'
import skMessages from '../../locales/sk.json'
import { Locale } from '../enums/locale'

export interface LocaleOption {
  code: Locale
  label: string
}

/** English and Slovak — the two languages every showcase app speaks. */
export const LOCALES: LocaleOption[] = [
  { code: Locale.EN_GB, label: 'English' },
  { code: Locale.SK_SK, label: 'Slovenčina' },
]

export const MESSAGES: Record<string, Record<string, string>> = {
  [Locale.EN_GB]: enMessages,
  [Locale.SK_SK]: skMessages,
}

export const DEFAULT_LOCALE: Locale = Locale.EN_GB

/** The locale where the app offers it, else the default — one kept in storage or on the account may be offered no more. */
export function offeredLocale(locale: Locale): Locale {
  return LOCALES.some((option) => option.code === locale) ? locale : DEFAULT_LOCALE
}

/**
 * English underneath every locale, so a key a locale leaves out reads in English rather than as a raw message id.
 * Not DEFAULT_LOCALE — that is the same open-key lookup and can miss in turn.
 */
export function messagesFor(locale: Locale): Record<string, string> {
  return { ...enMessages, ...(MESSAGES[locale] ?? {}) }
}
