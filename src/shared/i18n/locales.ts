import enMessages from '../../locales/en.json'
import skMessages from '../../locales/sk.json'
import { Locale } from '../enums/locale'
import type { Language } from '../types'

export interface LocaleOption {
  code: Locale
  /** The key the account keeps this locale under — what a pick sends. */
  language: Language
  label: string
}

/** English and Slovak — the two languages every showcase app speaks. */
export const LOCALES: LocaleOption[] = [
  { code: Locale.EN_GB, language: 'EN', label: 'English' },
  { code: Locale.SK_SK, language: 'SK', label: 'Slovenčina' },
]

export const MESSAGES: Record<string, Record<string, string>> = {
  [Locale.EN_GB]: enMessages,
  [Locale.SK_SK]: skMessages,
}

export const DEFAULT_LOCALE: Locale = Locale.EN_GB

/** The locale the app formats an account's language in — the default for a key this build does not know, or for none. */
export function localeOf(language: string | undefined): Locale {
  return LOCALES.find((option) => option.language === language)?.code ?? DEFAULT_LOCALE
}

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
